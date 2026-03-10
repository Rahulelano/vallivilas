const mongoose = require('mongoose');

const AppearanceSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    backgroundColor: {
        type: String,
        default: '#ffffff'
    },
    textColor: {
        type: String,
        default: '#000000'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appearance', AppearanceSchema);
