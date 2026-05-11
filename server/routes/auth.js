import express from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendOTPEmail, sendRegistrationOTPEmail } from '../services/emailService.js';
import bot from '../services/telegramBot.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Verify OTP again during registration for security
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.create({ name, email, password, phone });
    
    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send OTP to Email for Registration
router.post('/send-otp-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB
    await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });

    // 📧 Send Email
    await sendRegistrationOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Email OTP
router.post('/verify-otp-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secret, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login/Signup
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      // Note: For social login, we generate a random password and phone placeholder
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-10),
        phone: '0000000000' // Placeholder, user can update later
      });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
    const appToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secret, { expiresIn: '7d' });

    res.json({
      token: appToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

// 1. Request OTP for Password Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB (expires automatically)
    await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true });

    // Send Email
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('📧 [EMAIL ERROR]:', error);
    res.status(500).json({ message: error.message || 'Failed to send OTP' });
  }
});

// 2. Verify OTP and Reset Password
router.post('/verify-otp-reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if OTP matches
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Update user password
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User no longer exists' });

    user.password = newPassword;
    await user.save();

    // Delete OTP record after successful reset
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Facebook Login/Signup
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;

    // Verify token by calling Facebook Graph API
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${userID}?fields=id,name,email&access_token=${accessToken}`);
    const fbData = await fbRes.json();

    if (fbData.error || fbData.id !== userID) {
      return res.status(401).json({ message: 'Facebook authentication failed' });
    }

    const { name, email } = fbData;

    // If Facebook doesn't return email, create a placeholder
    const userEmail = email || `fb_${userID}@facebook.com`;

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name,
        email: userEmail,
        password: Math.random().toString(36).slice(-10),
        phone: '0000000000'
      });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
    const appToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secret, { expiresIn: '7d' });

    res.json({
      token: appToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('Facebook Auth Error:', error);
    res.status(500).json({ message: 'Facebook authentication failed' });
  }
});

// Update Phone Number
router.put('/update-phone', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_sweet_delight_2026';
    const decoded = jwt.verify(token, secret);
    
    const { phone } = req.body;
    await User.findByIdAndUpdate(decoded.id, { phone });
    
    res.json({ message: 'Phone updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
