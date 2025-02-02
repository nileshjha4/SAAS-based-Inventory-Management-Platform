const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
    couponCode:{
        type:String,
    },
    discount:{
        type:Number,
    },
    expiryDate:{
        type:Date,
    },
    status:{
        type:String,
        enum:['active','inactive'],
    }
});

const Coupon = mongoose.model('Coupon', couponSchema,'coupons');
module.exports = Coupon;