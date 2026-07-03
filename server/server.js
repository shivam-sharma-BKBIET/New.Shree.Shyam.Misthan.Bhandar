import express from 'express';
// Force server restart to apply schema updates
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import orderRoutes, { getBaseUrl } from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import telegramRoutes from './routes/telegram.js';
import siteRoutes from './routes/site.js';
import usersRoutes from './routes/users.js';
import './services/telegramBot.js'; 



dotenv.config();

// Ensure critical security environment variables are present
if (!process.env.JWT_SECRET || !process.env.ADMIN_API_KEY) {
  console.error("CRITICAL SECURITY ERROR: Missing JWT_SECRET or ADMIN_API_KEY in .env file!");
  console.error("Server cannot start without these security keys.");
  process.exit(1); // Force exit if keys are missing
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://new-shree-shyam-misthan-bhandar.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/users', usersRoutes);



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
  
      // Removed Telegram test message on startup to reduce noise and help with Render restarts
});

// Handle unhandled promise rejections (like DB connection failure) without crashing the server
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


