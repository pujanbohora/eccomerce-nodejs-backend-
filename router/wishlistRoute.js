const express = require("express");
const router = new express.Router();
const auth = require("../auth/auth");
const Product = require("../models/ProductModel");
const Wishlist = require("../models/wishlistModel");

router.post("/customer/wishlist/add", auth.verifyCustomer, auth.onlyCustomer, function (req, res) {

    const productId = req.body.productId;
    console.log('fav');

    const user = req.customerInfo._id;
    const data = new Wishlist({
        productId: productId,
        user: user
    })
    data.save().then(function () {
        res.json({ message: data });
    }).catch(function (e) {
        return res.status(400).json(e);
    })

});

router.get('/customer/wishlist/get', auth.verifyCustomer, auth.onlyCustomer, async function (req, res) {
    try {
        console.log('hello');
        let wishlistdata = await Wishlist.find({ user: req.customerInfo._id })
        // console.log(wishlistdata.productId);
        var finalData = []

        for (let index = 0; index < wishlistdata.length; index++) {
            console.log(wishlistdata[index].productId);
            let productdata = await Product.find({ _id: wishlistdata[index].productId })
            console.log(productdata);

            // console.log(productdata[index].product_title);
            let tempdata = {}
            tempdata["product"] = productdata
            finalData.push(tempdata);
            // resData = finalData
        }
        return res.json(finalData)
    }
    catch (e) {
        console.log('hello in catch');
        res.status(400).json({ e })
    }

});

router.delete('/wishlist/delete/:_id', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {

    const userId = req.customerInfo._id;
    const pid = req.params._id;
    console.log(pid)
    console.log(userId)

    Wishlist.deleteOne({ productId: pid, user: userId }).then(function (result) {
        console.log(result)
        console.log('you are in deleted sectioin');
        res.json({ message: "Deleted" })
    })
        .catch(function () {
            return res.status(400).json({ message: "Items can't deleted" });
        })
})

module.exports = router;