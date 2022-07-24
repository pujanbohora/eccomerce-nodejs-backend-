const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");

module.exports.verifyCustomer = function (req, res, next) {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const customertoken = jwt.verify(token, "anysecretkey");
            Customer.findOne({ _id: customertoken.custID }).then(function (custData) {
                req.customerInfo = custData;
                next();
            })
        }
        else {
            return res.status(400).json({ mesg: "Authorization required" });
        }
    }
    catch (e) {
        res.status(400).json({ error: e })
    }

}

module.exports.checkAdmin = function (req, res, next) {
    if(req.customerInfo.role !== "admin"){
        return res.status(400).json({message : "Admin access denied"});
    }
    next();
    
    // try {
    //     if (req.headers.authorization) {

    //         const token = req.headers.authorization.split(" ")[1];
    //         const customertoken = jwt.verify(token, "anysecretkey");

    //         Customer.findOne({ _id: customertoken.custID }).then(function (adminData) {
    //             if (adminData.role === 'admin') {
    //                 req.adminInfo = adminData;
    //                 console.log(req.adminInfo)
    //                 next();
    //             } else {
    //                 return res.json({ mesg: "Admin Access denied!!" })
    //             }
    //         })

    //     }
    //     else {
    //         return res.json({ mesg: "Authorization required" });
    //     }
    // }
    // catch (e) {
    //     res.json({ error: e })
    // }


}

module.exports.onlyCustomer = function (req, res, next) {

    if(req.customerInfo.role !== "user"){
        return res.status(400).json({message : "User access denied"});
    }
    next();

    // try {
    //     if (req.headers.authorization) {
    //         const token = req.headers.authorization.split(" ")[1];
    //         const customertoken = jwt.verify(token, "anysecretkey");

    //         Customer.findOne({ _id: customertoken.custID }).then(function (custData) {
    //             if (custData.role === 'user') {
    //                 req.userInfo = custData;

    //                 next();
    //             } else {
    //                 res.json({ mesg: "User Access denied!!" })
    //             }
    //         })
    //     }
    //     else {
    //         res.json({ mesg: "Authorization required" });
    //     }
    // }
    // catch (e) {
    //     res.json({ error: e })
    // }


}


