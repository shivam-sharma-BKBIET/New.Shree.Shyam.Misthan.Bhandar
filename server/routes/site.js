import express from 'express';
import Settings from '../models/Settings.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Admin Middleware (Simplified for this route, uses same API Key logic as admin.js)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'NewShyamSecretKey2026';
const verifyAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// --- PUBLIC ROUTES ---

// Get all site data (Initial load for frontend)
router.get('/data', async (req, res) => {
  try {
    const [settings, products, categories] = await Promise.all([
      Settings.findOne({ type: 'global' }),
      Product.find(),
      Category.find()
    ]);
    res.json({ settings, products, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ADMIN ROUTES ---

// Update Settings (Hero, About, Footer)
router.patch('/settings', verifyAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { type: 'global' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sync Products (Batch update from legacy localStorage if needed)
router.post('/products/sync', verifyAdmin, async (req, res) => {
  try {
    const { products } = req.body;
    await Product.deleteMany({}); // Clear existing
    const newProducts = await Product.insertMany(products);
    res.json(newProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sync Categories
router.post('/categories/sync', verifyAdmin, async (req, res) => {
  try {
    const { categories } = req.body;
    await Category.deleteMany({});
    const newCategories = await Category.insertMany(categories);
    res.json(newCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Product Update
router.patch('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
