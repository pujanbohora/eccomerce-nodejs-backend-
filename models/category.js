const mongoose = require('mongoose');

const Category = mongoose.model('Category', {
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
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
})

module.exports = Category;