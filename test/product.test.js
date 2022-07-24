const Product = require('../models/ProductModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Product testing', () => {

    let id = '';

    it('Product creating schema', () => {
        const Product_data = {
            'product_title': 'pawan',
            'slug': 'pawan',
            'product_price': '123',
            'product_quantity': '10',
            'product_description': 'hello',
            'product_image': "i'am image"
        };
        return Product.create(Product_data).
            then((p_data) => {
                id = p_data._id
                expect(p_data.product_title).toEqual('pawan');
            });
    })

    //this is for updating product 

    it('Product update', async () => {
        return Product.findOneAndUpdate({ _id: id },
            { $set: { product_title: 'test' }}, { new: true })
            .then((pp) => { expect(pp.product_title).toEqual('test') })
    });

    //this is for deleting user
    it('Product deleting', async () => {
        const status = await Product.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})