const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // tự động bỏ dấu cách ở 2 đầu khi lưu vào database
    },
    // đường dẫn của sản phẩm
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // viết thường
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    quantity: {
        type: Number,
        default: 0,
    },
    // sp đã bán
    sold: {
        type: Number,
        default: 0,
    },
    image: {
        type: Array,
    },
    color: {
        type: Boolean,
        enum: ['Black', 'White', '', 'Green', 'Yellow', 'Blue', 'Pink', 'Silver', 'Violet'], // enum: nằm trong giá trị cho trc
    },
    ratings: [{
        start: { type: Number },
        postedByUser: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
    }],
    // Có ng vote thì sẽ tự cộng vào
    totalRatings: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);