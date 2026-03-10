const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    gallery: [String],
    salePrice: { type: Number, required: true },
    regularPrice: { type: Number },
    discount: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    hot: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String },
    features: [String],
    stock: { type: Number, default: 10 },
    variants: [String],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
