const mongoose = require("mongoose");


const Product = mongoose.model("Product", {
    product_image: { 
        type: String,
        required: true
    },
    product_title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        required: true,
        trim: true,
        // max: 400
    },
    reviews: [
        {
            customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
            review: String
        }
    ],
    product_category: {
        type: mongoose.Types.ObjectId, ref: 'SubCategory',
        // required: true
    },
    // createdBy: {
    //     type: mongoose.Types.ObjectId, ref: 'Customer',
    //     required: true
    // },
    updateAt: Date,
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
})

module.exports = Product;