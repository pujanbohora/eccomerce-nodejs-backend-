const mongoose = require('mongoose');

const SubCategory = mongoose.model('SubCategory', {
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
    parentId: {
        type: mongoose.Types.ObjectId, ref: 'Category',
        // required: true
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

module.exports = SubCategory;