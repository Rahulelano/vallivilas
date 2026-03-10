require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Product = require('./models/Product');
const HeroSlide = require('./models/HeroSlide');
const Announcement = require('./models/Announcement');
const PromoBanner = require('./models/PromoBanner');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Admin.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await HeroSlide.deleteMany({});
        await Announcement.deleteMany({});
        await PromoBanner.deleteMany({});

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await Admin.create({ username: 'admin', password: hashedPassword });
        console.log('Admin created: user: admin, pass: admin123');

        // Seed Categories
        const cats = await Category.insertMany([
            { name: 'Havan Cups', slug: 'havan-cups', image: 'https://cdn.shopify.com/s/files/1/0610/1231/2230/files/Havan_Cup_500x650_84b67bbc-e023-4e21-abaf-26f94766710b.png?v=1770009914', discount: 'Upto 25% OFF', order: 1 },
            { name: 'Incense Sticks', slug: 'incense-sticks', image: 'https://cdn.shopify.com/s/files/1/0610/1231/2230/files/Incense_Sticks_500x650_e1d1d70e-1e46-4850-9138-7356536a0913.png?v=1770010033', discount: 'Upto 15% OFF', order: 2 },
        ]);

        // Seed Hero Slides
        await HeroSlide.insertMany([
            {
                image: "https://nirmalaya.com/cdn/shop/files/nirmalaya-banner-7-nov_jpg.jpg?v=1770642029&width=1920",
                title: "Pure Ghee. Pure Faith. Pure Devotion.",
                subtitle: "WAX-FREE PURE COW GHEE JYOT",
                hindi: "हर लौ में भक्ति",
                active: true,
                order: 1
            },
        ]);

        // Seed Announcements
        await Announcement.insertMany([
            { text: "🚚 FREE Shipping above ₹500/-", order: 1, active: true },
            { text: "🎁 Get a FREE Gift on orders above ₹498/-", order: 2, active: true },
        ]);

        // Seed Promo Banners
        await PromoBanner.insertMany([
            {
                type: 'full-width',
                image: 'https://nirmalaya.com/cdn/shop/files/nirmalya_banner_3.jpg?v=1735230956&width=3840',
                order: 1,
                active: true
            },
            {
                type: 'image-only',
                image: 'https://nirmalaya.com/cdn/shop/files/Attar_banner_1.png?v=1719399153&width=1920',
                order: 2,
                active: true
            },
            {
                type: 'split',
                image: 'https://nirmalaya.com/cdn/shop/files/GIFT-BOX-1_1_-min.webp?v=1719404011&width=800',
                title: 'Gift Boxes',
                subtitle: 'Express your love with sustainable premium gift options',
                cta: 'Check Out',
                order: 3,
                active: true
            },
            {
                type: 'image-only',
                image: 'https://nirmalaya.com/cdn/shop/files/Desktop_Final.png?v=1771247255&width=1920',
                order: 4,
                active: true
            }
        ]);
        console.log('Promo banners seeded');

        console.log('Seeding completed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
