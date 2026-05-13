import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  type: { type: String, default: 'global', unique: true },
  hero: {
    heading: String,
    subtext: String,
    image: String
  },
  about: {
    story: String,
    heritageText: String,
    heritageImage: String,
    ownerImage: String,
    ownerName: String,
    ownerQuote: String
  },
  footer: {
    shopName: String,
    description: String,
    addresses: [String],
    phoneNumbers: [String],
    email: String,
    hours: String
  },
  deliveryCharge: { type: Number, default: 0 },
  perKmCharge:        { type: Number, default: 10 },
  minDeliveryCharge:  { type: Number, default: 20 },
  maxDeliveryDistance:{ type: Number, default: 30 },
  shopLat:            { type: Number, default: 27.7 },
  shopLng:            { type: Number, default: 75.0 },
  adminAuth: {
    username: { type: String, default: 'admin' },
    password: { type: String, default: 'admin123' }
  }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
