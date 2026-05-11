import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import PaymentLog from '../models/PaymentLog.js';

const router = express.Router();

// The standard secret for Razorpay or generic gateway
// In production, this must be in .env: process.env.PAYMENT_GATEWAY_SECRET
const GATEWAY_SECRET = process.env.PAYMENT_GATEWAY_SECRET || 'test_secret_123';

/**
 * Core Integrity Engine
 * Processes a verified payment payload safely and idempotently.
 */
const processPaymentIntegrity = async (orderId, transactionId, amountPaid, source, fullPayload) => {
  try {
    // 1. Fetch Order
    const order = await Order.findById(orderId);
    if (!order) {
      await PaymentLog.create({ transactionId, orderId: null, source, payload: fullPayload, actionTaken: 'ORDER_NOT_FOUND' });
      return { success: false, message: 'Order not found' };
    }

    // 2. Idempotency Check (If already verified, do nothing)
    if (order.transactionStatus === 'PAYMENT_VERIFIED') {
      await PaymentLog.create({ transactionId, orderId, source, payload: fullPayload, actionTaken: 'IGNORED_ALREADY_VERIFIED' });
      return { success: true, message: 'Already processed' };
    }

    // 3. Amount Integrity Check
    let newStatus = 'PAYMENT_VERIFIED';
    let actionTaken = 'MARKED_VERIFIED';
    
    // Gateway amounts are typically sent in smallest currency unit (e.g., paise), we'll assume it's normalized to standard unit (INR) for this example or convert appropriately.
    // If it's Razorpay standard, amount is in paise, so amountPaid = fullPayload.payload.payment.entity.amount / 100
    // Assuming amountPaid is already normalized to standard INR format here.
    if (amountPaid < order.totalAmount) {
      newStatus = 'PARTIAL_PAYMENT';
      actionTaken = 'FLAGGED_PARTIAL_PAYMENT';
    } else if (amountPaid !== order.totalAmount) {
      newStatus = 'FRAUD_ATTEMPT'; // Could be overpaid, or tampering attempt
      actionTaken = 'FLAGGED_FRAUD_ATTEMPT';
    }

    // 4. Atomic Concurrency Save 
    // Using findOneAndUpdate with condition to prevent race conditions
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, transactionStatus: { $ne: 'PAYMENT_VERIFIED' } },
      { 
        $set: { 
          transactionStatus: newStatus,
          amountPaid: amountPaid,
          transactionId: transactionId || order.transactionId
        }
      },
      { new: true }
    );

    if (updatedOrder) {
      await PaymentLog.create({ transactionId, orderId, source, payload: fullPayload, actionTaken });
      return { success: true, status: newStatus };
    } else {
      // It might have been updated exactly during this ms by another thread
      await PaymentLog.create({ transactionId, orderId, source, payload: fullPayload, actionTaken: 'RACE_CONDITION_AVOIDED' });
      return { success: true, status: 'PAYMENT_VERIFIED' };
    }

  } catch (err) {
    console.error('Integrity Engine Error:', err);
    await PaymentLog.create({ transactionId, orderId, source, payload: fullPayload, actionTaken: `ERROR: ${err.message}` });
    throw err;
  }
};

/**
 * Endpoint 1: Secure Webhook Callback
 * Receives async callbacks from PG, verifies HMAC signature.
 */
router.post('/webhook', async (req, res) => {
  try {
    // 1. Extract signature
    const signature = req.headers['x-razorpay-signature'] || req.headers['x-gateway-signature'];
    if (!signature) {
      await PaymentLog.create({ source: 'WEBHOOK', payload: req.body, actionTaken: 'REJECTED_NO_SIGNATURE' });
      return res.status(400).send('Missing signature');
    }

    // 2. Verify Cryptographic HMAC Signature
    const payloadString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', GATEWAY_SECRET)
      .update(payloadString)
      .digest('hex');

    if (expectedSignature !== signature) {
      await PaymentLog.create({ source: 'WEBHOOK', payload: req.body, actionTaken: 'REJECTED_INVALID_SIGNATURE' });
      return res.status(400).send('Invalid signature');
    }

    // 3. Extract Payment Details
    // Mocking Razorpay typical payload structure
    const event = req.body;
    if (event.event === 'payment.captured' || event.event === 'payment.success') {
      const paymentEntity = event.payload?.payment?.entity || event;
      
      const orderId = paymentEntity.notes?.orderId || paymentEntity.order_id;
      const amountPaid = (paymentEntity.amount || 0) / 100; // Convert paise to INR
      const transactionId = paymentEntity.id;

      await processPaymentIntegrity(orderId, transactionId, amountPaid, 'WEBHOOK', event);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Server Error');
  }
});



export default router;
