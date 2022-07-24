const Cart = require('../models/cartModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Cart testing', () => {

    let id = '';

    it('Cart creating schema', () => {
        const Cart_data = {
            'isActive': 'false',
        };
        return Cart.create(Cart_data).
            then((cat_data) => {
                id = cat_data._id
                expect(cat_data.isActive).toEqual(false);
            });
    })

    //this is for updating product 

    it('Cart update', async () => {
        return Cart.findOneAndUpdate({ _id: id },
            { $set: { isActive: true }}, { new: true })
            .then((cat) => { expect(cat.isActive).toEqual(true) })
    });

    //this is for deleting user
    it('Cart deleting', async () => {
        const status = await Cart.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})