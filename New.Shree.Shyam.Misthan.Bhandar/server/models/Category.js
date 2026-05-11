import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  icon: { type: String, default: '🏷️' }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
