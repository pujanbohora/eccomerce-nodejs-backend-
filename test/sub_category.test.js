const SubCategory = require('../models/sub_category');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('SubCategory testing', () => {

    let id = '';

    it('SubCategory creating schema', () => {
        const SubCategory_data = {
            'name': 'test',
            'slug': 'test'
        };
        return SubCategory.create(SubCategory_data).
            then((Sub_cat_data) => {
                id = Sub_cat_data._id
                expect(Sub_cat_data.name).toEqual('test');
            });
    })

    //this is for updating product 

    it('SubCategory update', async () => {
        return SubCategory.findOneAndUpdate({ _id: id },
            { $set: { name: 'tester' }}, { new: true })
            .then((sub_cat) => { expect(sub_cat.name).toEqual('tester') })
    });

    //this is for deleting user
    it('SubCategory deleting', async () => {
        const status = await SubCategory.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})