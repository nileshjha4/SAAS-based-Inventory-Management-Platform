const mongoose = require('mongoose');
const { Schema } = mongoose;

const deliverySchema = new Schema({
    order_id:{
        type: Schema.Types.ObjectId,
        ref: 'Orders',
    },
    agent_id:{
        type: Schema.Types.ObjectId,
        ref: 'Agent',
    },
    status:{
        type:String,
        enum:['pending','delivered','cancelled'],
    },
    upi_ss_path:{
        type:String,
    },
    payment_ack:{
        type:Boolean,
        default:false
    }
});

const Delivery = mongoose.model('Delivery', deliverySchema, 'deliveries');
module.exports = Delivery;