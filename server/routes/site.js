import express from 'express';
import jwt from 'jsonwebtoken';
import Settings from '../models/Settings.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Admin Middleware
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ;
const verifyAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// User JWT or Admin Middleware
const verifyUserOrAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  if (apiKey && apiKey === ADMIN_API_KEY) {
    req.isAdmin = true;
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const secret = process.env.JWT_SECRET ;
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id || decoded._id || decoded.userId;
    req.isAdmin = false;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
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

// Sync Products (Batch update)
router.post('/products/sync', verifyAdmin, async (req, res) => {
  try {
    const { products } = req.body;
    await Product.deleteMany({});
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

// Single Product Update (Admin)
router.patch('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Product Add (Admin)
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Product Delete (Admin)
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Category Add (Admin)
router.post('/categories', verifyAdmin, async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Category Update (Admin)
router.patch('/categories/:id', verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Single Category Delete (Admin)
router.delete('/categories/:id', verifyAdmin, async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============================================
// SECURE REVIEW DELETE (JWT/Admin + Ownership Check)
// Admin can delete any review via x-admin-key
// =============================================
router.delete('/products/:productId/reviews/:reviewId', verifyUserOrAdmin, async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const requestingUserId = req.userId;
    const isAdmin = req.isAdmin;

    const product = await Product.findOne({ id: parseInt(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.find(r => r.id == reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // SECURITY: Admin can delete any review; users can only delete their own
    if (!isAdmin && review.userId && review.userId.toString() !== requestingUserId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    product.reviews = product.reviews.filter(r => r.id != reviewId);
    if (product.reviews.length > 0) {
      product.rating = parseFloat(
        (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      );
    }

    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
