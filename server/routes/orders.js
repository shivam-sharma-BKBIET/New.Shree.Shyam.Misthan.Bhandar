import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import os from 'os';
import bot from '../services/telegramBot.js';
import { sendOrderConfirmationEmail, sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from '../services/emailService.js';

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
    const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id || decoded._id || decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Place Order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, address, phone, orderRef, specialInstructions, paymentMethod, customerName } = req.body;
    let userId = req.userId;
    if (!userId && req.body.userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing or invalid token' });
    }

    const order = await Order.create({
      userId, items, totalAmount, address, phone, orderRef, specialInstructions, paymentMethod, customerName,
      transactionStatus: 'PENDING_VERIFICATION'
    });

    // Isolated Notifications (Non-Blocking)
    try {
      sendAdminNotification(order);
      sendTelegramNotification(order);
      // Send order confirmation email to customer
      User.findById(userId).then(user => {
        if (user?.email) {
          sendOrderConfirmationEmail(user.email, order)
            .then(() => console.log(`📧 Order confirmation email sent to ${user.email}`))
            .catch(err => console.error('📧 [EMAIL ERROR]', err.message));
        }
      });
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

// Get My Orders (Logged-in User Only)
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ userId: req.userId });
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalItems: totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track Order specific by Phone or Order ID
router.get('/track/status', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    // Verify JWT if provided — only return orders belonging to this user
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
        const decoded = jwt.verify(authHeader.split(' ')[1], secret);
        userId = decoded.id;
      } catch {}
    }

    const filter = { $or: [{ phone: query }, { orderRef: query }] };
    if (userId) filter.userId = userId; // restrict to logged-in user's orders only

    const order = await Order.findOne(filter).sort({ createdAt: -1 });
    if (!order) return res.status(404).json({ message: 'Order not found. Please check the details.' });

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

// Cancel Order Endpoint (by User)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Prevent cancellation if order is already processed or completed
    const nonCancellable = ['VERIFIED', 'PAYMENT_VERIFIED', 'DELIVERED', 'CANCELLED', 'PAYMENT_REJECTED'];
    if (nonCancellable.includes(order.transactionStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Update status
    order.transactionStatus = 'CANCELLED';
    await order.save();

    // Send Telegram alert to admin about cancellation
    try {
      sendTelegramCancellationNotification(order);
    } catch (telegramErr) {
      console.error('❌ [TELEGRAM ERROR] Cancellation alert failed:', telegramErr.message);
    }

    res.json({ message: 'Order cancelled successfully', status: 'CANCELLED' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const sendTelegramNotification = async (order) => {
  try {

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Strict Env Variable Check
    if (!botToken || !chatId || botToken.includes('your_bot')) {
      console.error("⚠️ [TELEGRAM ERROR] Missing or invalid Telegram environment variables!");
      return;
    }

    // 2. Debug Logging
    console.log("📡 [TELEGRAM] Attempting to send message to Chat ID:", chatId);

    const isCod = order.paymentMethod === 'cod';
    const methodText = isCod ? "💵 *Cash on Delivery (COD)*" : "📱 *UPI (Online)*";
    const instructionCheck = isCod 
      ? "👉 *COD Order! Deliver package and collect cash!*" 
      : `👉 Check your UPI/Bank app for ₹${order.totalAmount}`;

    const escapedName = order.customerName ? order.customerName.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&') : 'Not provided';

    const text = `
🆕 *NEW ORDER ALERT (${isCod ? 'COD' : 'UPI'})\\!*
━━━━━━━━━━━━━━━
🆔 *Ref:* \`${order.orderRef}\`
👤 *Name:* ${escapedName}
📞 *Phone:* ${order.phone}
💰 *Amount:* ₹${order.totalAmount}
💳 *Method:* ${methodText}
🏠 *Address:* ${order.address || 'Not provided'}
📝 *Instructions:* ${order.specialInstructions ? order.specialInstructions.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&') : '_None_'}
━━━━━━━━━━━━━━━
${instructionCheck}
*Then press the button below to confirm:*
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



const sendTelegramCancellationNotification = async (order) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Strict Env Variable Check
    if (!botToken || !chatId || botToken.includes('your_bot')) {
      console.error("⚠️ [TELEGRAM ERROR] Missing or invalid Telegram environment variables!");
      return;
    }

    // 2. Debug Logging
    console.log("📡 [TELEGRAM] Attempting to send order cancellation message to Chat ID:", chatId);

    const isCod = order.paymentMethod === 'cod';
    const methodText = isCod ? "💵 *Cash on Delivery (COD)*" : "📱 *UPI (Online)*";
    const escapedName = order.customerName ? order.customerName.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&') : 'Not provided';

    const text = `
🚫 *ORDER CANCELLED BY CUSTOMER*
━━━━━━━━━━━━━━━
🆔 *Ref:* \`${order.orderRef}\`
👤 *Name:* ${escapedName}
📞 *Phone:* ${order.phone}
💰 *Amount:* ₹${order.totalAmount}
💳 *Method:* ${methodText}
━━━━━━━━━━━━━━━
⚠️ *Notice:* Customer has cancelled this order. Please do not prepare/deliver it.
    `.trim();

    if (bot) {
      await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
      console.log('✅ [TELEGRAM] Order cancellation notification sent successfully');
    }
  } catch (error) {
    console.error('❌ [TELEGRAM ERROR] Order cancellation notify failed:', error.message);
  }
};



const sendAdminNotification = async (order) => {
  // Always log verification link to terminal for manual reference
  console.log('\n-------------------------------------------');
  console.log('🚀 NEW ORDER PLACED!');
  console.log(`Order Ref: ${order.orderRef}`);
  console.log(`Amount:    Rs. ${order.totalAmount}`);
  console.log(`Phone:     ${order.phone}`);
  console.log('-------------------------------------------\n');
};



export default router;
