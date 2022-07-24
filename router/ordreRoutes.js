const express = require("express");
const router = new express.Router();
const Order = require('../models/orderModel');
const auth = require("../auth/auth");
const Address = require('../models/addressModel');
const Product = require('../models/ProductModel');
const Customer = require('../models/customerModel');
const Cart = require('../models/cartModel');
const { _logFunc } = require("nodemailer/lib/shared");




router.post('/addOrder', auth.verifyCustomer, auth.onlyCustomer, async function (req, res) {
    // req.body.customer = req.customerInfo._id;

    let cartObj = await Cart.findOne({ customer: req.customerInfo._id })

    let tempitems = [];
    let temptotal = 0;

    for (let index = 0; index < cartObj.cartItems.length; index++) {
        let productObj = await Product.findOne({ product: cartObj.cartItems[index]._id })

        let tempItem = {
            productId: cartObj.cartItems[index].product,
            purchasedQty: cartObj.cartItems[index].quantity,
        }

        temptotal = cartObj.cartItems[index].price;
        tempitems.push(tempItem);
    }
    console.log(req.body)

    const order = new Order({
        customer: req.customerInfo._id,
        totalAmount: temptotal,
        items: tempitems,
        addressId: req.body.addressId
    }

    );
    order.isCompleted = true;
    order.orderStatus = "ordered";

    order.save().then(function (order) {
        if (order) {
            res.json({ order });
        }
        else {
            return res.json("error");
        }
    });
});

router.get('/customer/get/orders', auth.verifyCustomer, auth.onlyCustomer, async function (req, res) {
    try {
        let orderdata = await Order.find({ customer: req.customerInfo._id })

        var finalData = []

        for (let index = 0; index < orderdata.length; index++) {
            console.log(orderdata[index].addressId);
            let addressdata = await Address.findOne({ _id: orderdata[index].addressId });
            let tempdataorder = {}
            tempproducts = []

            for (let productindex = 0; productindex < orderdata[index].items.length; productindex++) {
                console.log(orderdata[index].items.length);
                let productdata = await Product.findOne({ _id: orderdata[index].items[productindex].productId })
                console.log('hello');
                tempproducts.push(productdata.product_title);
            }

            tempdataorder["products"] = tempproducts
            tempdataorder["address"] = addressdata.address, addressdata.locality
            tempdataorder["locality"] = addressdata.locality

            tempdataorder["totalAmount"] = orderdata[index].totalAmount
            tempdataorder["orderStatus"] = orderdata[index].orderStatus
            tempdataorder["date"] = orderdata[index].created_at
            tempdataorder["isCompleted"] = orderdata[index].isCompleted

            finalData.push(tempdataorder);
        }
        resData = finalData
        console.log(resData)

        return res.json(resData)
    }
    catch (e) {
        res.status(400).json({ e })
    }
});

router.get('/admin/dashboard/get/orders', auth.verifyCustomer, auth.checkAdmin, async function (req, res) {
    try {
        let orderdata = await Order.find({})


        var finalData = []

        for (let index = 0; index < orderdata.length; index++) {
            let addressdata = await Address.findOne({ _id: orderdata[index].addressId });
            let userdata = await Customer.findOne({ _id: orderdata[index].customer });
            let tempdata = {}


            for (let indexx = 0; indexx < orderdata[index].items.length; indexx++) {
                let productData = await Product.find({ _id: orderdata[index].items[indexx].productId })

                totalprice = productData[index].product_price * orderdata[index].items[indexx].purchasedQty
                tempdata["name"] = productData[indexx].product_title
                tempdata["image"] = productData[indexx].product_image
                tempdata["price"] = productData[index].product_price
                tempdata["slug"] = productData[indexx].slug
                tempdata["quantity"] = orderdata[index].items[indexx].purchasedQty
            }
            tempdata["email"] = userdata.email

            tempdata["address"] = addressdata.address
            tempdata["locality"] = addressdata.locality
            tempdata["usernanme"] = addressdata.name
            tempdata["number"] = addressdata.mobileNumber

            tempdata["totalAmount"] = orderdata[index].totalAmount
            tempdata["orderStatus"] = orderdata[index].orderStatus
            tempdata["date"] = orderdata[index].created_at
            tempdata["isCompleted"] = orderdata[index].isCompleted
            finalData.push(tempdata)
            console.log(finalData)

            // finalData.push(tempdata);
        }

        return res.json(finalData)
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ e })
    }
});

//customer change status

router.get('/admin/get/orderStatus/:orderStatus', auth.verifyCustomer, auth.checkAdmin, async function (req, res) {

    orderStatus = req.params.orderStatus

    try {
        let orderdata = await Order.find({ orderStatus: orderStatus })
        console.log(orderdata);


        var finalData = []

        for (let index = 0; index < orderdata.length; index++) {
            let addressdata = await Address.findOne({ _id: orderdata[index].addressId });
            let userdata = await Customer.findOne({ _id: orderdata[index].customer });
            let tempdata = {}
            // console.log(userdata);
            // console.log(addressdata);
            console.log(orderdata[index].items.length)


            for (let indexx = 0; indexx < orderdata[index].items.length; indexx++) {
                let productData = await Product.findOne({ _id: orderdata[index].items[indexx].productId })

                totalprice = productData.product_price * orderdata[index].items[indexx].purchasedQty
                tempdata["name"] = productData.product_title
                tempdata["image"] = productData.product_image
                tempdata["price"] = productData.product_price
                tempdata["slug"] = productData.slug
                tempdata["quantity"] = orderdata[index].items[indexx].purchasedQty
            }
            tempdata["email"] = userdata.email

            tempdata["address"] = addressdata.address
            tempdata["locality"] = addressdata.locality
            tempdata["usernanme"] = addressdata.name
            tempdata["number"] = addressdata.mobileNumber

            tempdata["_id"] = orderdata[index]._id
            tempdata["totalAmount"] = orderdata[index].totalAmount
            tempdata["orderStatus"] = orderdata[index].orderStatus
            tempdata["date"] = orderdata[index].created_at
            tempdata["isCompleted"] = orderdata[index].isCompleted
            finalData.push(tempdata)
            console.log(finalData)

            // finalData.push(tempdata);
        }

        return res.json(finalData)
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ e })
    }
});

router.post('/admin/order/change/status/:_id', auth.verifyCustomer, auth.checkAdmin, async function (req, res) {

    _id = req.params._id

    try {

        let orderobj = await Order.findOne({ _id: _id })
        const status = req.body.status
        console.log(status)
        orderobj.orderStatus = status;
        orderobj.save();

        return res.json({ mesg: 'Success' });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ e })
    }
});

module.exports = router;

