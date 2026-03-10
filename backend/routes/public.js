const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const HeroSlide = require('../models/HeroSlide');
const Announcement = require('../models/Announcement');
const PromoBanner = require('../models/PromoBanner');
const InstagramPost = require('../models/InstagramPost');
const Appearance = require('../models/Appearance');
const FooterAsset = require('../models/FooterAsset');
const PromoPopup = require('../models/PromoPopup');

// Get all instagram posts
router.get('/instagram-posts', async (req, res) => {
    try {
        const posts = await InstagramPost.find({ active: true }).sort('order');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all announcements
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true }).sort('order');
        res.json(announcements);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all hero slides
router.get('/hero-slides', async (req, res) => {
    try {
        const slides = await HeroSlide.find({ active: true }).sort('order');
        res.json(slides);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort('order');
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get single category by slug
router.get('/categories/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json({ msg: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get products (with optional category filter, hot, search)
router.get('/products', async (req, res) => {
    try {
        const { category, hot, limit, search } = req.query;
        let query = {};

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) query.category = cat._id;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (hot) query.hot = true;

        let productsQuery = Product.find(query).populate('category');
        if (limit) productsQuery = productsQuery.limit(parseInt(limit));

        const results = await productsQuery.exec();
        res.json(results);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get product details
router.get('/products/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all promo banners
router.get('/promo-banners', async (req, res) => {
    try {
        const banners = await PromoBanner.find({ active: true }).sort('order');
        res.json(banners);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// Get all appearance settings
router.get('/appearance', async (req, res) => {
    try {
        const appearance = await Appearance.find();
        res.json(appearance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all footer assets
router.get('/footer-assets', async (req, res) => {
    try {
        const assets = await FooterAsset.find({ active: true }).sort('order');
        res.json(assets);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get active promo popup
router.get('/promo-popup', async (req, res) => {
    try {
        const popup = await PromoPopup.findOne({ isActive: true }).sort('-createdAt');
        res.json(popup);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
