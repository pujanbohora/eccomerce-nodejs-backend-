const mongoose = require('mongoose');

const Address = mongoose.model("Address", {
  name: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 50,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  locality: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  cityDistrictTown: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    min: 10,
    max: 100,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,ref: "Customer",
    // required: true,
    
  }

});

module.exports = Address;

