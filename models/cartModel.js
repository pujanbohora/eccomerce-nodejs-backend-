const mongoose = require('mongoose');

const Cart = mongoose.model('Cart', {
    customer: {
        type: mongoose.Types.ObjectId, ref: 'Customer',
        // required: true
    },
    cartItems: [
        {
            product: {
                type: mongoose.Types.ObjectId, ref: 'Product',
                required: true
            },
            quantity: { type: Number, default: 1 },
            price: { type: Number }
        }
    ],
    isActive: { type: Boolean, default: true },
    created_at: {
        type: Date,
        require: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        require: true,
        default: Date.now
    }

})

module.exports = Cart;