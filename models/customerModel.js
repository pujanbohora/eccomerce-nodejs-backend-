const mongoose = require("mongoose");

const Customer = mongoose.model("Customer", {
    fullname: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    contactNumber: {
        type: String,
    },
    profilePicture: {
        type: String
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


module.exports = Customer;