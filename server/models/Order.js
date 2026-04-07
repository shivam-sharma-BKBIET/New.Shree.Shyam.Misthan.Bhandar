import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, default: 'upi' },
  transactionStatus: { 
    type: String, 
    enum: ['PENDING_ADMIN_APPROVAL', 'VERIFIED_PAID', 'PAYMENT_REJECTED', 'PENDING_VERIFICATION', 'PAYMENT_VERIFIED', 'FRAUD_ATTEMPT', 'PARTIAL_PAYMENT', 'VERIFIED', 'CANCELLED'], 
    default: 'PENDING_VERIFICATION' 
  },
  amountPaid: { type: Number },
  orderRef: { type: String, required: true },
  transactionId: { type: String },
  deliveryDate: { type: String },
  deliveryTime: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
