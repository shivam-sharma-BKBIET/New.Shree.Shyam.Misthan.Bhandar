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
  }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
