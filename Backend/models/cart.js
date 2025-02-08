const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    item_id:{
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    qty:{
        type: Number,
    },
    sum_amt:{
        type: Number,
    },
    discount_amt:{
        type: Number,
    },
    discount_percentage:{
        type:Number
    },
})

const cartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    cart: [orderSchema],
    total: {
        type: Number,
        default: 0
    },
    final_amount:{
        type:Number
    },
    status:{
        type:String,
        enum: ['pending', 'cancelled', 'delivered'],
    },
    coupon:{
        type:String,
    }
});

const Cart = mongoose.model('Cart', cartSchema, 'carts');
module.exports = Cart;