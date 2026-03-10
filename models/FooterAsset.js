const mongoose = require('mongoose');

const FooterAssetSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
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

module.exports = mongoose.model('FooterAsset', FooterAssetSchema);
