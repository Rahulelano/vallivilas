const mongoose = require('mongoose');

const PromoPopupSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: '#'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    showAlways: {
        type: Boolean,
        default: false // If false, shows once per session. If true, shows every time.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PromoPopup', PromoPopupSchema);
