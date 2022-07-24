const express = require("express");
const Pagenation = require('../models/pagerModel');
const Category = require('../models/category');
const upload = require("../uploads/images_files");
const slugify = require("slugify");
const router = new express.Router();
const auth = require("../auth/auth");

router.post("/pagination/create", auth.verifyCustomer, auth.checkAdmin, upload.array('pagenation_image'), function (req, res) {

    let pagenation_image = [];

    if (req.files.length > 0) {
        pagenation_image = req.files.map((file) => {
            return { img: file.filename };
        });
    }

    const paginationData = new Pagenation({
        pagenation_image: pagenation_image,
        createdBy: req.customerInfo._id,
        ofCategory: req.body.ofCategory
    })

    paginationData.save().then(function () {
        res.json({ message: "Pagination Inserted" });
    }).catch(function () {
        return res.status(400).json({ message: "Pagination cannot be uploaded" });
    })
})

router.post('/getpagination/:id', function (req, res) {
    Pagenation.findOne({ id: req.params._id }).then(function (result) {
        res.json(result)
        console.log(result);
    })
        .catch(function () {
            return res.status(400).json({ message: "something went wrong" })
        })
})

router.get('/show/pagination', async function (req, res) {

    let adsdata = await Pagenation.find({})
    var finaldata = []

    for (let index = 0; index < adsdata.length; index++) {
        let tempdata = {}
        console.log(adsdata[index].name);
        let catdata = await Category.find({ _id: adsdata[index].ofCategory })
        for (let index = 0; index < catdata.length; index++) {
            tempdata["catname"] = catdata[index].name
            
            
        }
        tempdata["id"] = adsdata[index]._id
        
        tempdata["img"] = adsdata[index].pagenation_image.length
        finaldata.push(tempdata)

    }

    resData = finaldata

    return res.json(resData)
})

router.get('/admin/category_ads/:slug', async function (req, res) {
    const slug = req.params.slug;

    Category.findOne({ slug: slug }, (async (error, categories) => {
        if (error) {
            console.log('failed');
            return res.status(400).json({ error: error });
        };

        let ads = await Pagenation.find({ ofCategory: categories._id })

        if (ads) {
            res.json({ ads });
        }
    }),
    )
});

router.delete('/pagination/delete/:_id', auth.verifyCustomer, auth.checkAdmin, function (req, res) {

    Pagenation.deleteOne({ id: req.params._id }).then(function () {
        res.json({ message: "Ad deleted" })


    }).catch(function () {
        return res.status(400).json({ message: "Ad" })
    });
});


module.exports = router;