import mongoose from 'mongoose';

const paymentLogSchema = new mongoose.Schema({
  transactionId: { type: String },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  source: { type: String, enum: ['WEBHOOK', 'POLLING'], required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  actionTaken: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('PaymentLog', paymentLogSchema);
