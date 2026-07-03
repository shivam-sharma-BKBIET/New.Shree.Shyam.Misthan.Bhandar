import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, default: null },
  phone: { type: String, default: null },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 600 } // OTP expires in 10 minutes
});

export default mongoose.model('OTP', otpSchema);
