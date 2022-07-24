const express = require("express");
const Category = require('../models/category');
const slugify = require('slugify');
const auth = require("../auth/auth");
const res = require("express/lib/response");
const SubCategory = require('../models/sub_category');
const router = express.Router();

function createCategories(categories, parentId = null) {

    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    }
    else {
        category = categories.filter(cat => cat.parentId == parentId);
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList;
};

router.post('/create/category', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    cat.save((error, category) => {
        if (error) {
            return res.status(400).json({ error: error });
        };
        if (category) {

            return res.json({ mesg: "category saved" });
        }
    })

});

router.post('/admin/create/category', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name),
    }
    const cat = new Category(categoryObj);
    cat.save((error, subCategory) => {
        if (error) {
            return res.status(400).json({ error: error });
        };
        if (subCategory) {
            
            return res.json({ mesg: "category saved" , success: true });
        }
    })

});

router.get('/admin/getcategory', auth.verifyCustomer, auth.checkAdmin, async function (req, res) {
    let CategoryObject = await Category.find({});
    let finalData = []

    for (let index = 0; index < CategoryObject.length; index++) {
        let tempSubCatList = await SubCategory.find({ parentId: CategoryObject[index]._id });

        let tempcatBySubCategory = {}
        tempcatBySubCategory["category"] = CategoryObject[index]
        tempcatBySubCategory["sub_cat_name"] = tempSubCatList
        finalData.push(tempcatBySubCategory)  
    }

    return res.json(finalData)
});

router.get('/single/category/view/:_id', auth.verifyCustomer, auth.checkAdmin,  function (req, res) {
    const cat = req.params._id;
    Category.find({_id : cat}, ((error, categories) => {
        if (error) {
            console.log('failed');
            return res.status(400).json({ error: error });
        };

        if (categories) {
            // console.log(categories);
            const categoryList = createCategories(categories);
            res.json({ categoryList });
        }
    }),
    )
});

router.get('/getcategory', function (req, res) {

    Category.find({}, ((error, categories) => {
        if (error) {
            console.log('failed');
            return res.status(400).json({ error: error });
        };

        if (categories) {
            // console.log(categories);
            const categoryList = createCategories(categories);
            res.json(categories);
        }
    }),
    )
});

router.put('/admin/category/update/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const cid = req.params._id;
    // console.log(req.body)

    Category.updateOne({ _id: cid }, {
        name: req.body.name,
        slug: req.body.slug
    }).then(function () {
        res.json({ message: "Category update", success: true })
    }).catch(function () {
        return res.status(400).json({ message: "Something went wrong" })
    })
})

router.delete('/category/delete/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {

    Category.deleteOne({ _id: req.params._id }).then(function () {
        res.json({ message: "Category deleted", success: true })


    }).catch(function () {
        return res.status(400).json({ message: "sub category can't be  deleted" })
    });
});




module.exports = router; 