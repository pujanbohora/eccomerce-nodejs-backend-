const express = require('express');
const Cart = require('../models/cartModel');
const auth = require("../auth/auth");
const Product = require('../models/ProductModel');
const router = express.Router();

router.post('/customer/cart/addtocart', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {

    Cart.findOne({ customer: req.customerInfo._id }).then(function (cart) {
        if (cart) {
            //cart already exists update quantity

            const product = req.body.cartItems.product;
            const item = cart.cartItems.find(c => {
                console.log(c.product)
                c.product == product
            });
            console.log(product);
            console.log(item);

            if (item) {
                // console.log(item);
                Cart.findOneAndUpdate({ "customer": req.customerInfo._id, "cartItems.product": product }, {
                    "$set": {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity,
                        }
                    }

                }).then(function (_cart) {
                    if (_cart) {
                        console.log(_cart);
                        return res.json({ cart: _cart });
                    }
                })
            }
            else {
                Cart.findOneAndUpdate({ customer: req.customerInfo._id }, {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }
                }).then(function (_cart) {
                    if (_cart) {
                        console.log(_cart + 'jjj');
                        return res.json({ cart: _cart });
                    }
                })
            }

            // res.json({ message: 'cart' });

        }
        else {
            //if cart doesnot exists then create a new cart
            console.log(req.body)
            const cart = new Cart({
                customer: req.customerInfo._id,
                cartItems: [req.body.cartItems]
            });
            cart.save().then(function () {
                res.json({ message: cart });
            }).catch(function (e) {
                console.log(e)
                return res.status(400).json({ message: "cart cannot be inserted" });
            });

        }
    });


});

router.delete("/customer/cart/delete", auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    const customer = req.customerInfo._id;

    Cart.deleteOne({ customer: customer }).then(function () {
        res.json({ message: "cart Item Deleted" })
    })
        .catch(function () {
            return res.status(400).json({ message: "Cart Items can't be deleted" })
        })
})

router.get('/customer/cart/all', auth.verifyCustomer, auth.onlyCustomer, async function (req, res) {

    const customer = req.customerInfo._id;
    try {
        let tempCart = await Cart.findOne({ customer: req.customerInfo._id })

        console.log(tempCart);
        // res.json(tempCart);

        var finaldata = [];

        for (let index = 0; index < tempCart.cartItems.length; index++) {
            let tempProduct = await Product.find({ _id: tempCart.cartItems[index].product })

            let temp = {}
            temp["product"] = tempProduct
            temp["quantity"] = tempCart.cartItems[index].quantity
            finaldata.push(temp)
        }
        resData = finaldata
        res.json(resData)

    } catch (error) {
        return res.status(400).json({ message: "Problem while fetching data" });

    }




})

module.exports = router;
