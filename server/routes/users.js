import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile Details (Name, Phone)
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, phone } },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new Address
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: 'Address is required' });

    const user = await User.findById(req.userId);
    user.addresses.push(address);
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Address
router.delete('/addresses/:index', verifyToken, async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.userId);
    
    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    user.addresses.splice(index, 1);
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
