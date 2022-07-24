const Address = require('../models/addressModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Address testing', () => {

    let id = '';

    it('Address creating schema', () => {
        const Address_data = {
            'name': 'false',
            'mobileNumber': 'false',
            'locality': 'false',
            'address': 'false',
            'cityDistrictTown': 'false',
            'landmark': 'false'
        };
        return Address.create(Address_data).
            then((add_data) => {
                id = add_data._id
                expect(add_data.name).toEqual('false');
            });
    })

    //this is for updating product 

    it('Address update', async () => {
        return Address.findOneAndUpdate({ _id: id },
            { $set: { name: 'test' }}, { new: true })
            .then((add) => { expect(add.name).toEqual('test') })
    });

    //this is for deleting user
    it('Address deleting', async () => {
        const status = await Address.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})