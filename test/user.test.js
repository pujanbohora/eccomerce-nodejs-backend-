const Customer = require('../models/customerModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('User testing', () => {

    let id = '';

    it('User creating schema', () => {
        const user = {
            'email': 'pujanbohrora@gmail.com',
            'password': 'pujanbohora123'
        };
        return Customer.create(user).
            then((u_data) => {
                id = u_data._id
                expect(u_data.email).toEqual('pujanbohrora@gmail.com');
            });
    })

    //this is for updateing user profile
    it('User update', async () => {
        return Customer.findOneAndUpdate({ _id: id },
            { $set: { email: 'pawan123@gmail.com' }}, { new: true })
            .then((uu) => { expect(uu.email).toEqual('pawan123@gmail.com') })
    });

    //this is for deleting user
    it('User deleting', async () => {
        const status = await Customer.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})