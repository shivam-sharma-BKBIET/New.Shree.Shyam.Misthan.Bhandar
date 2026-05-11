import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: '1 kg' },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  description: { type: String },
  image: { type: String },
  reviews: [{
    id: Number,
    userId: String,
    username: { type: String, default: 'Anonymous' },
    user: String,
    rating: Number,
    comment: String,
    date: Date
  }]
}, { timestamps: true, strict: false });

export default mongoose.model('Product', productSchema);
