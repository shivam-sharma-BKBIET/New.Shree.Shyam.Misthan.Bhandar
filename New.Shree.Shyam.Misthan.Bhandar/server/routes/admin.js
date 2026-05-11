import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import crypto from 'crypto';
import { sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from '../services/emailService.js';

const router = express.Router();

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'NewShyamSecretKey2026';

// Middleware to verify Admin API Key
const verifyAdmin = async (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Protect all admin routes globally
router.use(verifyAdmin);

// Get all orders (Paginated)
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find()
      .populate('userId', 'name email phone')
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

// Get all customers (Paginated)
router.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const customers = await User.find({ isAdmin: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: customers,
      totalPages: Math.ceil(totalCustomers / limit),
      currentPage: page,
      totalItems: totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete customer
router.delete('/customers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Manual Approval/Rejection)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { transactionStatus: status },
      { new: true }
    ).populate('userId', 'email name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Send email based on new status
    const customerEmail = order.userId?.email;
    if (customerEmail) {
      if (status === 'PAYMENT_VERIFIED' || status === 'VERIFIED') {
        sendPaymentVerifiedEmail(customerEmail, order)
          .then(() => console.log(`✅ Admin panel: Verified email sent to ${customerEmail}`))
          .catch(e => console.error('📧 Email error:', e.message));
      } else if (status === 'PAYMENT_REJECTED' || status === 'CANCELLED') {
        sendPaymentRejectedEmail(customerEmail, order)
          .then(() => console.log(`❌ Admin panel: Rejected email sent to ${customerEmail}`))
          .catch(e => console.error('📧 Email error:', e.message));
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order schedule Date & Time
router.patch('/orders/:id/schedule', async (req, res) => {
  try {
    const { deliveryDate, deliveryTime } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { deliveryDate, deliveryTime },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
