const express = require("express");
const SubCategory = require('../models/sub_category');
const slugify = require('slugify');
const auth = require("../auth/auth");
const res = require("express/lib/response");
const router = express.Router();

router.post('/create/Subcategory', auth.verifyCustomer, auth.checkAdmin, function (req, res) {
    const SubcategoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name),
        parentId: req.body.parentId,
    }
    const cat = new SubCategory(SubcategoryObj);
    cat.save((error, subCategory) => {
        if (error) {

            console.log(error);
            return res.status(400).json({ error: error });
        };
        if (subCategory) {
            
            return res.json({ mesg: "Sub category saved", success: true });
        }
    })

});

router.put('/subcategory/update/:_id', auth.verifyCustomer, auth.checkAdmin, function(req, res){
    const scid = req.params._id;
    // console.log(req.body)

    SubCategory.updateOne({_id : scid},{
        name: req.body.name,
        slug: req.body.slug,
    }).then(function(){
        res.json({message: "Sub Category update"})
    }).catch(function(){
        return res.status(400).json({message: "Something went wrong"})
    })
})

router.get('/subcategory/single/:_id', auth.verifyCustomer, auth.checkAdmin, function(req, res){
    const scid = req.params._id;

    SubCategory.findOne({_id: scid}).then(function(result){
        res.json(result)
    })
    .catch(function(){
        return res.status(400).json({message: "something  went wrong"})
    })
})

router.get('/admin/subcategory/show', function(req, res){

    SubCategory.find({}).then(function(result){
        res.json(result)
    })
    .catch(function(){
       return res.status(400).json({message: "something  went wrong"})
    })
})

router.delete('/subcategory/:slug/delete', auth.verifyCustomer, auth.checkAdmin, function (req, res) {

    SubCategory.deleteOne({ slug: req.params.slug }).then(function () {
        res.json({ message: "sub Category deleted" })


    }).catch(function () {
        return res.status(400).json({ message: "sub category can't be  deleted" });
    });
});

module.exports = router;