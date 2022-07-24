const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../auth/auth")

const { validateSignupRequest, isRequestValidate, validateSigninRequest } = require('../../validator/auth');

const router = new express.Router();

const Customer = require("../../models/customerModel");



router.post("/admin/signup", validateSignupRequest, isRequestValidate, function (req, res) {
    const email = req.body.email;
    Customer.findOne({ email: email })
        .then(function (customerData) {
            if (customerData != null) {
                res.json({ message: "Admin/Email already in use" });
                return;
            }

            const password = req.body.password;

            bcryptjs.hash(password, 10, function (e, hashed_value) {
                const data = new Customer({
                    email: email,
                    password: hashed_value,
                    role: 'admin'
                })
                data.save().then(function () {
                    res.json({ message: "Admin created Sccess" });
                }).catch(function (e) {
                    res.json(e);
                })
            })

        });

})
// router.post("/admin/login", validateSigninRequest, isRequestValidate, function (req, res) {
//     const email = req.body.email
//     Customer.findOne({ email: email }).then(function (customerData) {
//         if (customerData === null) {
//             return res.json({ message: "Admin Invalid Login" })
//         };
//         const password = req.body.password;
//         bcryptjs.compare(password, customerData.password, function (e, result) {
//             if (result == false && Customer.role === 'admin') {
//                 console.log(result);
//                 return res.json({ message: "Admin Invalid Password" })
//             }
//             else {
//                 console.log(result);
//                 const token = jwt.sign({ custID: customerData._id, role: customerData.role }, "anysecretkey", { expiresIn: '1h' });
//                 res.json({ token: token, message: "Admin success" });
//             }
//         })


//     })
// })

router.post("/admin/login", validateSigninRequest, isRequestValidate, function (req, res) {
    const email = req.body.email
    Customer.findOne({ email: email }).then(function (customerData) {
        if (customerData === null) {
            return res.json({ message: "Admin Invalid Login" })
        }
        else {
            const password = req.body.password;
            bcryptjs.compare(password, customerData.password, function (e, result) {
                if (result == true && customerData.role === 'admin') {
                    console.log(customerData.role);
                    console.log(customerData._id);
                    console.log(result);
                    const token = jwt.sign({ custID: customerData._id, role: customerData.role }, "anysecretkey", { expiresIn: '1d' });
                    const { _id, fullname, email, role } = customerData;
                    // res.cookies("token", token, {expiresIn: "1d"});
                    res.json({ token: token, customerData: { _id, fullname, email, role } });
                }
                else {
                    return res.json({ message: "Admin Invalid Password" })
                }
            })
        }



    })
})

module.exports = router;