import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import orderRoutes, { getBaseUrl } from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import telegramRoutes from './routes/telegram.js';
import './services/telegramBot.js'; 



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/telegram', telegramRoutes);


// Root
app.get('/', (req, res) => {
  res.send('Sweet Shop Backend API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB Connection Error:', error.message));

// Start listening (Render/Persistent Hosting) - Moved outside DB connection to satisfy Port Binding checks
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 BASE_URL for Mobile Magic Links: ${getBaseUrl()}`);
  
  // Test Telegram Connection on startup
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (botToken && chatId && !botToken.includes('your_bot')) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🚀 *Sweet Shop Server Online!*\nYour Telegram Bot is now connected and ready for orders on Render.",
          parse_mode: 'Markdown'
        })
      });
      console.log('✅ Telegram Bot Test MSG sent successfully!');
    } catch (err) {
      console.error('❌ Telegram Bot Setup Error:', err.message);
    }
  }
});

// Handle unhandled promise rejections (like DB connection failure) without crashing the server
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


