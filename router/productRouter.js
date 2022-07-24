const express = require("express");
const router = new express.Router();
const Product = require('../models/ProductModel');
const upload = require("../uploads/images_files");
const slugify = require("slugify");
const { validateSigninRequest, isRequestValidate } = require('../validator/auth');
const auth = require("../auth/auth");
const SubCategory = require("../models/sub_category");
const Category = require("../models/category");
const Pagenation = require("../models/pagerModel");
const Customer = require('../models/customerModel');

router.put("/product/add/review/:_id", auth.verifyCustomer, auth.onlyCustomer, function (req, res) {
    let reviews = []
    const pid = req.params._id
    Product.findOne({ _id: pid }).then(function (prodData) {
        reviews = prodData.reviews
        let user_reviews = {
            "review": req.body.review,
            "customerId": req.customerInfo._id
        }
        reviews.push(user_reviews)
        Product.updateOne({ _id: pid }, { reviews: reviews })
            .then(function () {
                res.json({ "msg": "Review Added" })
            }).catch(function () {
                res.status(400).json({ err: "Error in Review!" })
            })

    })
})

router.get("/user/show/review/:_id", auth.verifyCustomer, auth.onlyCustomer, async function (req, res) {

    const pid = req.params._id

    const cid = req.customerInfo._id


    let productInfo = await Product.findOne({ _id: pid })

    var finaldata = []

    // console.log(productInfo.product_title);

    let tempuser = {}

    for (let index = 0; index < productInfo.reviews.length; index++) {

        let allCus = await Customer.find({ _id: productInfo.reviews[index].customerId });
        for (let index = 0; index < allCus.length; index++) {
            tempuser["email"] = allCus[index].email,
                tempuser["fullname"] = allCus[index].fullname
        }

        tempuser["review"] = productInfo.reviews[index].review
        tempuser["date"] = productInfo.reviews[index].date
        finaldata.push(tempuser);

    }


    resData = finaldata

    return res.json(resData)


})

router.delete('/review/delete', auth.verifyCustomer, auth.onlyCustomer, function (req, res) {

    const review = req.body.review;
    const customerId = req.customerInfo._id;

    Product.updateOne(
        { 'reviews._id': review, "reviews.customerId": customerId },
        {
            $pull: {
                reviews: { _id: review }
            }
        }).then(function () {
            res.json({ message: "Review has been deleted" })
        })
        .catch(function () {
            return res.status(400).json({ message: "Review can't be deleted" });
        })
})

router.post("/product/create", auth.verifyCustomer, auth.checkAdmin, upload.single('product_image'), function (req, res) {

    // let product_image = [];

    // if (req.files.length > 0) {
    //     product_image = req.files.map((file) => {
    //         return { img: file.filename };
    //     });
    // }
    console.log(req.file);

    const productData = new Product({
        product_title: req.body.product_title,
        slug: slugify(req.body.product_title),
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_image: req.file.filename,
        product_quantity: req.body.product_quantity,
        product_category: req.body.product_category,
        // createdBy: req.customerInfo._id,
    })

    productData.save().then(function () {
        res.json({ message: "Product Inserted", success: true });
    }).catch(function (e) {
        return res.status(400).json(e);

    })
})

router.put('/product/update/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const pid = req.params._id;
    // console.log(req.body)

    Product.updateOne({ _id: pid }, {
        product_title: req.body.product_title,
        slug: req.body.slug,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_quantity: req.body.product_quantity,
        product_category: req.body.product_category
    }).then(function () {
        return res.json({ message: "Product update" })
    }).catch(function (e) {
        //    return res.status(400).json({ message: "Something went wrong" });
        console.log(e);
    })
})

router.delete('/product/delete/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {

    const userId = req.customerInfo._id;
    const pid = req.params._id;

    Product.deleteOne({ _id: pid, createdBy: userId }).then(function () {
        res.json({ message: "Deleted" })
    })
        .catch(function () {
            return res.status(400).json({ message: "Items can't deleted" });
        })
})

router.get('/product/single/:_id', async function (req, res) {
    const pid = req.params._id;
    try {
        let productObject = await Product.findOne({ _id: pid })


        let subCategoryObject = await SubCategory.findOne({ _id: productObject.product_category })
        let CategoryObject = await Category.findOne({ _id: subCategoryObject.parentId })

        return res.json({
            "product": productObject,
            "subCategory": subCategoryObject.name,
            "Category": CategoryObject.name
        })

    } catch (error) {
        return res.status(400).json({ message: "Fetching Single Product" });

    }
})

router.get('/product/show', function (req, res) {

    Product.find({}).then(function (result) {
        res.json(result)
    })
        .catch(function () {
            res.json({ message: "something  went wrong" })
        })
})

router.get('/product/admin/show', async function (req, res) {

    let ShowProductDetails = await Product.aggregate([
        {
            $lookup: {
                from: "subcategories",
                localField: "product_category",
                foreignField: "_id",
                as: "subcategory"
            }
        },
        {
            $unwind: "$subcategory"
        },
    ]);
    return res.json(ShowProductDetails);
})

router.get('/admin/show/all/product_with_category', async function (req, res) {
    let tempAllProductList = await Product.find({});

    var finalData = []

    for (let index = 0; index < tempAllProductList.length; index++) {

        let subCategory = await SubCategory.findOne({ _id: tempAllProductList[index].product_category });
        let categoryObject = await Category.findOne({ _id: subCategory.parentId });
        console.log(subCategory);
        let tempproducts = {}
        tempproducts["product"] = tempAllProductList[index]
        tempproducts["sub_cat_name"] = subCategory.name
        tempproducts["cat_name"] = categoryObject.name
        console.log(categoryObject.name);
        tempproducts["ads"] = await Pagenation.find({ ofCategory: categoryObject._id })
        finalData.push(tempproducts)

    }
    resData = finalData

    return res.json(resData)
})

router.get('/admin/show/single/product_with_category/:slug', async function (req, res) {
    const slug = req.params.slug;

    let tempSingleCategoryList = await Category.findOne({ slug: slug })

    var finalData = []


    const subCategory = await SubCategory.find({ parentId: tempSingleCategoryList._id });

    for (let index = 0; index < subCategory.length; index++) {
        let productObject = await Product.find({ _id: subCategory[index].product_category });

        let temp = {}

        temp["cat_name"] = tempSingleCategoryList.name
        temp["sub_cat_name"] = subCategory.name
        temp['products'] = productObject[index]
        finalData.push(temp)

    }
    resData = finalData
    return res.json(resData)
})

router.get('/search/:pname', async function (req, res) {
    const pname = req.params.pname
    await Product.find({ "product_title": { "$regex": pname, "$options": "i" } }).then(function(result){
        res.json(result);
    })
    .catch(function(){
        res.json({message : "something went wrong"})
    })

})

module.exports = router;
