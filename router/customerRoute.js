const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = new express.Router();
const nodemailer = require("nodemailer");

const { validateSignupRequest, isRequestValidate, validateSigninRequest } = require('../validator/auth');

const auth = require("../auth/auth");
const upload = require("../uploads/images_files");
const Customer = require("../models/customerModel");

//to insert -> post

//Sign up
router.post("/signup", validateSignupRequest, function (req, res) {
    const email = req.body.email;
    Customer.findOne({ email: email })
        .then(function (customerData) {
            if (customerData != null) {
                res.status(400).json({ message: "Email already in use" });
                return;
            }

            else {
                console.log("mail sent");
                const password = req.body.password;

                bcryptjs.hash(password, 10, function (e, hashed_value) {
                    const data = new Customer({
                        email: email,
                        password: hashed_value,

                    })
                    data.save().then(function () {
                        res.json({ message: data });
                    }).catch(function (e) {
                        return res.status(400).json(e);
                    })
                })
            }
        });

})

//login 
router.post("/signin", validateSigninRequest, isRequestValidate, function (req, res) {
    const email = req.body.email
    Customer.findOne({ email: email }).then(function (customerData) {
        if (customerData === null) {
            return res.status(400).json({ message: "Invalid login" })
        };
        const password = req.body.password;
        bcryptjs.compare(password, customerData.password, function (e, result) {
            console.log(result);
            if (result == false) {
                return res.status(400).json({ message: "Invalid Password" })
            }

            else {
                const token = jwt.sign({ custID: customerData._id, role: customerData.role }, "anysecretkey"); //to get id from db customerData._id
                res.json({ token: token, message: "success" });
            }
        })
    })
})

//profile update of the customer
router.put("/customer/profile/update", auth.verifyCustomer, auth.onlyCustomer, auth.checkAdmin, function (req, res) {
    // consolel.log(req.customerInfo);
    // console.log(req.customerInfo._id);
    const cid = req.customerInfo._id;
    const email = req.body.email;
    const fullname = req.body.fullname;
    const contactNumber = req.body.contactNumber;
    const profilePicture = req.body.profilePicture;
    Customer.updateOne({ _id: cid }, { email: email, fullname: fullname, contactNumber: contactNumber, profilePicture: profilePicture }).then(function () {
        res.json({ msg: "Profile updated!", success: true })
    }).catch(function () {
        res.status(400).json({ msg: "Couldn't update profile" });
    });
    // res.json(req.customerInfo);
})

//delete customer by itself
router.delete("/customer/profile/delete", auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    // res.json({ mesg: "deleted" });
    const cid = req.cusotmerInfo._id;
    Customer.findByIdAndDelete(cid).then(function () {
        res.json({ msg: "Customer deleted" }).catch(function () {
            res.status(400).json({ msg: "Couldn't delete profile" });
        })
    });
})

router.get('/customer/viewprofile', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    const cid = req.customerInfo._id;

    Customer.find({ _id: cid }).then(function (result) {
        res.status(200).json(result)
    })
        .catch(function () {
            res.status(400).json({ message: "Customer canot be viewed" })
        })
})

router.get('/admin/customer/details', auth.verifyCustomer, auth.checkAdmin, function (req, res) {

    Customer.find({}).then(function (result) {
        res.json(result)
    })
        .catch(function () {
            res.json({ message: "something  went wrong" })
        })
})

// router.post('/logout', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
//     req.body.deleteToken(req.token, (err, user) => {
//         if (err) return res.status(400).send(err);
//         res.sendStatus(200);
//     });


// })

router.post('/resetpassword', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    const user = req.customerInfo._id;
    const passowrd = req.body.password;
    console.log(user);

    Customer.updateOne({ _id: user }, { password: req.body.password }).then(function () {
        res.json({ msg: "Password has been updated!", success: true })
    }).catch(function () {
        res.status(400).json({ msg: "Couldn't update password" });
    });

})

router.put('/admin/change/customer/role/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const userid = req.params._id;

    Customer.updateOne({ _id: userid }, {
        role: req.body.role
    }).then(function () {
        return res.json({ message: "User role updated" })
    }).catch(function (e) {
        //    return res.status(400).json({ message: "Something went wrong" });
        console.log(e);
    })
})
module.exports = router;