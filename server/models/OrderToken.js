import mongoose from 'mongoose';

const orderTokenSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Token expires in 24 hours
});

export default mongoose.model('OrderToken', orderTokenSchema);
