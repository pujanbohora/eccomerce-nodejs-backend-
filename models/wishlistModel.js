const mongoose = require('mongoose');

const Wishlist = mongoose.model("Wishlist", {
  
  user: {
    type: mongoose.Schema.Types.ObjectId,ref: "Customer",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,ref: "Product",
    required: true,
  }

});

module.exports = Wishlist;

