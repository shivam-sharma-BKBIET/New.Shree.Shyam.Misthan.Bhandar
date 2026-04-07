import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  description: { type: String },
  image: { type: String },
  reviews: [{
    id: Number,
    user: String,
    rating: Number,
    comment: String,
    date: Date
  }]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
