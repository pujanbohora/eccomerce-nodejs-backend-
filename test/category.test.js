const Category = require('../models/category');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Category testing', () => {

    let id = '';

    it('Category creating schema', () => {
        const Category_data = {
            'name': 'pawan',
            'slug': 'pawan',
        };
        return Category.create(Category_data).
            then((c_data) => {
                id = c_data._id
                expect(c_data.name).toEqual('pawan');
            });
    })

    //this is for updating product 

    it('Category update', async () => {
        return Category.findOneAndUpdate({ _id: id },
            { $set: { name: 'testtt' }}, { new: true })
            .then((cat) => { expect(cat.name).toEqual('testtt') })
    });

    //this is for deleting user
    it('Category deleting', async () => {
        const status = await Category.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})