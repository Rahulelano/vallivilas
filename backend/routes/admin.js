const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Category = require('../models/Category');
const HeroSlide = require('../models/HeroSlide');
const Announcement = require('../models/Announcement');
const PromoBanner = require('../models/PromoBanner');
const InstagramPost = require('../models/InstagramPost');
const Appearance = require('../models/Appearance');
const FooterAsset = require('../models/FooterAsset');
const PromoPopup = require('../models/PromoPopup');

const upload = require('../middleware/upload');
const User = require('../models/User');
const Order = require('../models/Order');
const { sendProductUpdate } = require('../utils/mailer');

// Generic CRUD helper (simplified for brevity)
const createAdminRoutes = (Model, name) => {
    // Get all
    router.get(`/${name}`, auth, async (req, res) => {
        try {
            let query = Model.find().sort('-createdAt');
            if (name === 'products') {
                query = query.populate('category', 'name');
            }
            const items = await query;
            res.json(items);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });

    // Create
    router.post(`/${name}`, auth, upload.single('image'), async (req, res) => {
        try {
            console.log(`Creating ${name}:`, req.body);
            const data = req.file
                ? { ...req.body, image: `/uploads/${req.file.filename}` }
                : req.body;

            const newItem = new Model(data);
            await newItem.save();

            // Notify users if a new product is added
            if (name === 'products') {
                const users = await User.find({ role: 'customer' });
                users.forEach(user => {
                    // sendProductUpdate(user.email, newItem);
                });
            }

            res.json(newItem);
        } catch (err) {
            console.error(`Error creating ${name}:`, err);
            res.status(500).json({
                msg: `Error creating ${name}`,
                error: err.message,
                details: err.errors // Mongoose validation errors
            });
        }
    });

    // Update
    router.put(`/${name}/:id`, auth, upload.single('image'), async (req, res) => {
        try {
            console.log(`Updating ${name} (${req.params.id}):`, req.body);
            const data = req.file
                ? { ...req.body, image: `/uploads/${req.file.filename}` }
                : req.body;

            const item = await Model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }
            res.json(item);
        } catch (err) {
            console.error(`Error updating ${name}:`, err);
            res.status(500).json({
                msg: `Error updating ${name}`,
                error: err.message,
                details: err.errors
            });
        }
    });

    // Delete
    router.delete(`/${name}/:id`, auth, async (req, res) => {
        try {
            await Model.findByIdAndDelete(req.params.id);
            res.json({ msg: 'Deleted successfully' });
        } catch (err) {
            res.status(500).send('Server Error');
        }
    });
};

// Custom routes for products to handle multi-file uploads
router.get('/products', auth, async (req, res) => {
    try {
        const items = await Product.find().populate('category', 'name').sort('-createdAt');
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/products', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
    try {
        console.log('Creating product:', req.body);
        const data = { ...req.body };
        if (req.files['image']) {
            data.image = `/uploads/${req.files['image'][0].filename}`;
        }
        if (req.files['gallery']) {
            data.gallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
        }

        const newItem = new Product(data);
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ msg: 'Error creating product', error: err.message });
    }
});

router.put('/products/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
    try {
        console.log('Updating product:', req.params.id, req.body);
        const data = { ...req.body };
        if (req.files['image']) {
            data.image = `/uploads/${req.files['image'][0].filename}`;
        }
        if (req.files['gallery']) {
            const newGallery = req.files['gallery'].map(file => `/uploads/${file.filename}`);
            // If we have existing gallery images sent as a string/array, merge or replace?
            // For now, let's assume we replace the gallery if new files are uploaded, 
            // OR if gallery is sent as JSON in req.body.
            if (req.body.existingGallery) {
                const existing = Array.isArray(req.body.existingGallery) ? req.body.existingGallery : [req.body.existingGallery];
                data.gallery = [...existing, ...newGallery];
            } else {
                data.gallery = newGallery;
            }
        } else if (req.body.gallery) {
            // If no new files but gallery order/content changed via JSON
            data.gallery = Array.isArray(req.body.gallery) ? req.body.gallery : [req.body.gallery];
        }

        const item = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ msg: 'Product not found' });
        res.json(item);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ msg: 'Error updating product', error: err.message });
    }
});

router.delete('/products/:id', auth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Use generic helper for others
createAdminRoutes(Category, 'categories');
createAdminRoutes(HeroSlide, 'hero-slides');
createAdminRoutes(Announcement, 'announcements');
createAdminRoutes(PromoBanner, 'promo-banners');
createAdminRoutes(InstagramPost, 'instagram-posts');
createAdminRoutes(Appearance, 'appearance');
createAdminRoutes(FooterAsset, 'footer-assets');
createAdminRoutes(PromoPopup, 'promo-popups');

// Special route for order status updates
router.put('/orders/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Register generic routes but override the GET to populate user
createAdminRoutes(Order, 'orders');

// Override GET orders to populate user
router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
