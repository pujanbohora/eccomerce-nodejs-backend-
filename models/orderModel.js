const mongoose = require('mongoose');

const Order = mongoose.model('Order',
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            // required: true,
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            // required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                purchasedQty: {
                    type: Number,
                    required: true,
                }, 
            },
        ],
        orderStatus: {
            type: String,
            enum: ["ordered", "packed", "shipped", "delivered"],
            default: "ordered",
        },
        date: {
            type: Date,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },


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
    },
);

module.exports = Order;