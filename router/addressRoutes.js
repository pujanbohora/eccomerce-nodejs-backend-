const express = require("express");
const router = new express.Router();
const Address = require('../models/addressModel');
const auth = require("../auth/auth");


router.post('/customer/address/create', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {

    const addressData = new Address({
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
        locality: req.body.locality,
        address: req.body.address,
        cityDistrictTown: req.body.cityDistrictTown,
        landmark: req.body.landmark,
        user: req.customerInfo._id,
    })

    console.log(addressData);
    addressData.save().then(function () {
        res.json({ message: "Address saved", addressId: addressData._id, success: true });
    }).catch(function (e) {
        return res.status(400).json(e);

    })
});

router.get('/customer/getaddress', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    try {
        Address.findOne({ user: req.customerInfo._id }).then(function (userAddress, error) {
            if (userAddress) {
                res.json({ userAddress });
                return;
            }
            else {
                return res.json({ error });
            }
        })
    }
    catch (e) {
        return res.status(400).json({ error: e })
    }
})

router.get('/customer/delete/address', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    try {
        UserAddress.deleteOne({ _id: req.customerInfo._id }).then(function (userAddress, error) {
            res.json({ message: "Deleted" })
        })
    }
    catch (e) {
        return res.status(400).json({ error: e })
    }
})

module.exports = router;