import express from 'express';
import Order from '../models/Order.js';
import OrderToken from '../models/OrderToken.js';
import crypto from 'crypto';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import os from 'os';
import bot from '../services/telegramBot.js';

const router = express.Router();

// Auto-detect local IP for mobile phone connectivity
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioritize interfaces that look like real WiFi or Ethernet
        if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('ethernet')) {
          return iface.address;
        }
        candidates.push(iface.address);
      }
    }
  }
  return candidates.length > 0 ? candidates[0] : 'localhost';
};

export const getBaseUrl = () => {
  if (process.env.BASE_URL && !process.env.BASE_URL.includes('localhost')) {
    return process.env.BASE_URL;
  }
  const ip = getLocalIp();
  const url = `http://${ip}:5000`;
  return url;
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Place Order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, address, phone, orderRef } = req.body;
    let userId = req.userId;
    if (!userId && req.body.userId) {
      userId = req.body.userId;
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing or invalid token' });
    }

    const order = await Order.create({ 
      userId, items, totalAmount, address, phone, orderRef,
      transactionStatus: 'PENDING_VERIFICATION' 
    });

    // Generate secure token for magic link
    const token = crypto.randomBytes(32).toString('hex');
    await OrderToken.create({ orderId: order._id, token });

    // Isolated Notifications (Non-Blocking)
    try {
      sendAdminNotification(order, token);
      sendTelegramNotification(order, token);
    } catch (notifyError) {
      console.error("🔔 [NOTIFICATION FAILED] Orders saved but alerts failed:", notifyError.message);
    }

    res.status(201).json({ 
      message: 'Order placed, awaiting approval', 
      orderId: order._id,
      orderRef: order.orderRef 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track Order specific by Phone or Order ID
router.get('/track/status', async (req, res) => {
  try {
    const { query } = req.query; // this can be phone or orderRef
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    // Search by both phone and orderRef (assuming an EXACT match on either)
    const order = await Order.findOne({
      $or: [{ phone: query }, { orderRef: query }]
    }).sort({ createdAt: -1 });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json({ 
      status: order.transactionStatus, 
      orderRef: order.orderRef,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check Order Status (For Frontend Polling)
router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if the ID is a valid MongoDB ObjectId to avoid Cast Error
    if (id.length !== 24) {
      return res.status(404).json({ message: 'Invalid Order ID format' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json({ status: order.transactionStatus, orderRef: order.orderRef });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Verify Portal (Mobile Web UI for Admin)
router.get('/verify-portal/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { token } = req.query;

  try {
    const orderToken = await OrderToken.findOne({ orderId, token });
    if (!orderToken) return res.status(403).send('<h1 style="text-align:center;font-family:sans-serif;margin-top:50px;">Invalid or Expired Link</h1>');

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send('<h1 style="text-align:center;font-family:sans-serif;margin-top:50px;">Order Not Found</h1>');

    const baseUrl = getBaseUrl();
    const approveUrl = `${baseUrl}/api/orders/admin-action/${order._id}?action=approve&token=${token}`;
    const rejectUrl = `${baseUrl}/api/orders/admin-action/${order._id}?action=reject&token=${token}`;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fdfbfb; margin: 0; padding: 20px; text-align: center; }
          .card { background: white; border-radius: 12px; padding: 30px 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 400px; margin: 0 auto; }
          h2 { color: #2d3436; margin-top: 0; }
          .amount { font-size: 2rem; color: #e65100; font-weight: bold; margin: 15px 0 25px; }
          .btn { display: block; width: 100%; padding: 15px; font-size: 1.2rem; font-weight: bold; text-decoration: none; border-radius: 8px; margin-bottom: 15px; color: white; border: none; cursor: pointer; }
          .btn-approve { background: #27ae60; }
          .btn-reject { background: #e74c3c; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Order Payment Verification</h2>
          <p style="color: #636e72; margin-bottom: 5px;">Order Ref: <strong>${order.orderRef}</strong></p>
          <div class="amount">₹${order.totalAmount}</div>
          <p style="margin-bottom: 30px;">Did you receive this payment in your Bank/UPI app?</p>
          
          <a href="${approveUrl}" class="btn btn-approve">YES - Payment Received</a>
          <a href="${rejectUrl}" class="btn btn-reject">NO - Missing Payment</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Admin Approval Action (Magic Link Callback)
router.get('/admin-action/:orderId', async (req, res) => {
  const { action, token } = req.query;
  const { orderId } = req.params;

  try {
    const orderToken = await OrderToken.findOne({ orderId, token });
    if (!orderToken) return res.status(403).send('<h1>Invalid or Expired Token</h1>');

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send('<h1>Order Not Found</h1>');

    if (order.transactionStatus === 'PAYMENT_VERIFIED') {
      await OrderToken.deleteOne({ _id: orderToken._id });
      return res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px; background: #f0fff4;">
          <h1 style="color: #2f855a;">🤖 Handled by Automated S2S Gateway</h1>
          <p>This order was already verified automatically by the payment gateway infrastructure.</p>
        </div>
      `);
    }

    if (action === 'approve') {
      order.transactionStatus = 'PAYMENT_VERIFIED';
      await order.save();
      await OrderToken.deleteOne({ _id: orderToken._id });
      res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px; background: #f0fff4;">
          <h1 style="color: #2f855a;">✅ Order Verified</h1>
          <p>Payment confirmed for Order #${order.orderRef}. Staff can now pack this order.</p>
        </div>
      `);
    } else if (action === 'reject') {
      order.transactionStatus = 'PAYMENT_REJECTED';
      await order.save();
      await OrderToken.deleteOne({ _id: orderToken._id });
      res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px; background: #fff5f5;">
          <h1 style="color: #c53030;">❌ Order Cancelled</h1>
          <p>Payment rejected for Order #${order.orderRef}. Fake payment blocked.</p>
        </div>
      `);
    } else {
      res.status(400).send('<h1>Invalid Action</h1>');
    }
  } catch (error) {
    res.status(500).send('<h1>Server Error</h1>');
  }
});

const sendTelegramNotification = async (order, token) => {
  try {
    const baseUrl = getBaseUrl();
    const portalUrl = `${baseUrl}/api/orders/verify-portal/${order._id}?token=${token}`;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Strict Env Variable Check
    if (!botToken || !chatId || botToken.includes('your_bot')) {
      console.error("⚠️ [TELEGRAM ERROR] Missing or invalid Telegram environment variables!");
      return;
    }

    // 2. Debug Logging
    console.log("📡 [TELEGRAM] Attempting to send message to Chat ID:", chatId);

    const text = `
🆕 *NEW ORDER ALERT!*
🆔 *Ref:* ${order.orderRef}
👤 *User ID:* ${order.userId}
📞 *Phone:* ${order.phone}
💰 *Amount:* ₹${order.totalAmount}

*DID THE PAYMENT ARRIVE?*
Select an action below to update the order status.
    `.trim();

    // 3. Reliable Message Sending via Singleton Bot Service
    if (bot) {
      await bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Yes, Approve", callback_data: `approve_${order._id}` },
              { text: "❌ No, Reject", callback_data: `reject_${order._id}` }
            ]
          ]
        }
      });
      console.log('✅ [TELEGRAM] Notification sent successfully');
    } else {
      throw new Error("Telegram bot service not initialized");
    }
  } catch (error) {
    console.error('❌ [TELEGRAM ERROR] Notification Failed:', error.message);
  }
};



const sendAdminNotification = async (order, token) => {
  const baseUrl = getBaseUrl();
  const portalUrl = `${baseUrl}/api/orders/verify-portal/${order._id}?token=${token}`;
  const adminPhone = process.env.ADMIN_PHONE || '+918529434514';
  
  // Format based on strict specification
  const message = `New Order: Rs. ${order.totalAmount} by ${order.userId}. Verify payment here: ${portalUrl}`;

  // ALWAYS log the portal URL to the console for the owner to see in the terminal
  console.log('\n-------------------------------------------');
  console.log('🚀 NEW ORDER PLACED!');
  console.log(`Order Ref: ${order.orderRef}`);
  console.log(`Amount: Rs. ${order.totalAmount}`);
  console.log(`VERIFICATION LINK: ${portalUrl}`);
  console.log('-------------------------------------------\n');

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || accountSid.includes('your_twilio')) {
      throw new Error('Twilio credentials not configured in .env');
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: adminPhone
    });
    console.log('✅ SMS Admin notification sent');
  } catch (error) {
    console.error('❌ SMS Notification Failed:', error.message);

    // Fallback: Construct Direct WhatsApp Link for Manual Sharing
    const cleanPhone = adminPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('\n--- ADMIN MANUAL ACTION (SMS FAILED) ---');
    console.log('If you did not receive the SMS, please click or share this link:');
    console.log(whatsappUrl);
    console.log('-------------------------------------------\n');
  }
};

export default router;
