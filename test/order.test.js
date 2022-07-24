const Order = require('../models/orderModel');
const mongoose = require('mongoose');

// use the new name of the database
const url = 'mongodb://localhost:27017/testing_thegadgetzone_Eccomerce';
beforeAll(async () => {
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Order testing', () => {

    let id = '';

    it('Order creating schema', () => {
        const Order_data = {
            'totalAmount': '100',
            'orderStatus': 'packed'
        };
        return Order.create(Order_data).
            then((order_data) => {
                id = order_data._id
                expect(order_data.orderStatus).toEqual('packed');
            });
    })

    //this is for updating product 

    it('Order update', async () => {
        return Order.findOneAndUpdate({ _id: id },
            { $set: { orderStatus: 'delivered' }}, { new: true })
            .then((ord) => { expect(ord.orderStatus).toEqual('delivered') })
    });

    //this is for deleting user
    it('Order deleting', async () => {
        const status = await Order.deleteMany();
        expect(status.deletedCount).toBe(1);

    })

})