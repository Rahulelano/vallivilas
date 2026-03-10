const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    hindi: { type: String },
    cta: { type: String, default: 'Shop Now' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
