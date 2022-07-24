const express = require("express");
const router = new express.Router();
const Product = require('../models/ProductModel');
const Category = require('../models/category');
const auth = require("../auth/auth"); const { db } = require("../models/ProductModel");
const SubCategory = require("../models/sub_category");

router.get('/category/subcategory/products', function (req, res) {
    db.collection('Category').aggregate([
        {
            $lookup: {
                from: "Category",
                localField: "_id",
                foreignField: "parent_id",
                as: "sub_category"
            }
        },
        { $unwind: "$sub_category" }
        // ])
    ]).toArray(function (err, res) {
        if (err)
            throw err;
        console.log(res);
    });
});

router.get('/all_category/with_product/:slug',async function (req, res) {
   
        slug = req.params.slug
        let categoryObj = await Category.findOne({slug:slug});
        let ads = await Category.aggregate([
            {
                $match: {"slug": slug}
            },
            {
                $lookup: {
                    from: "pagenations",
                    localField: "_id",
                    foreignField: "ofCategory",
                    as: "ads"
                }

            },
        ]);

        let subCategories = await SubCategory.find({parentId:categoryObj._id});
        var productsBySubCategory = []

        console.log(ads);

        for (let index = 0; index < subCategories.length; index++) {
            
            let tempProductList = await Product.find({product_category: subCategories[index]._id});
            let tempproductsBySubCategory = {}
            tempproductsBySubCategory["sub_category"] = subCategories[index]
            tempproductsBySubCategory["products"] = tempProductList
            productsBySubCategory.push(tempproductsBySubCategory)

            
        }
        
        resData = {
            "ads": ads[0].ads[0].pagenation_image,
            "productsBySubCategory":productsBySubCategory
        }

        return res.json(resData)
})

module.exports = router;