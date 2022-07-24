const mongoose = require("mongoose");


const Pagenation = mongoose.model("Pagenation", {
    pagenation_image: [
        {
            img: { type: String }
        }
    ],
    createdBy: {
        type: mongoose.Types.ObjectId, ref: 'Customer',
        // required: true
    },
    ofCategory: {
        type: mongoose.Types.ObjectId, ref: 'Category',
        // required: true
    },
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

module.exports = Pagenation;