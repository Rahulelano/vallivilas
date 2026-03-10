const mongoose = require('mongoose');

const InstagramPostSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        default: 'image'
    },
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

module.exports = mongoose.model('InstagramPost', InstagramPostSchema);
