const mongoose = require('mongoose');

const PromoBannerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['full-width', 'split', 'image-only'],
        default: 'image-only'
    },
    image: {
        type: String,
        required: true
    },
    title: String,
    subtitle: String,
    cta: String,
    link: {
        type: String,
        default: '#'
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PromoBanner', PromoBannerSchema);
