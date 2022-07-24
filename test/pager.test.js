const Pagenation = require('../models/pagerModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Pagenation testing', () => {

    let id = '';

    it('Pagenation creating schema', () => {
        const Pagenation_data = {
            'pagenation_image': [{img :'test'}]
        };
        return Pagenation.create(Pagenation_data).
            then((P_data) => {
                id = P_data._id
                expect(P_data.pagenation_image[0].img).toEqual('test');
            });
    })

    //this is for updating product 

    it('Pagenation update', async () => {
        return Pagenation.findOneAndUpdate({ _id: id },
            { $set: { pagenation_image: [{img :'tester'}] }}, { new: true })
            .then((pp) => { expect(pp.pagenation_image[0].img).toEqual('tester') })
    });

    //this is for deleting user
    it('Pagenation deleting', async () => {
        const status = await Pagenation.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})