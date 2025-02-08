const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventorySchema = new Schema({
    item:{
        type: String
    },
    flavour:{
        type:String
    },
    company:{
        type: String
    },
    minqty:{
        type:Number
    },
    qty:{
        type:Number
    },
    price:{
        type:Number
    },
    description:{
        type:String
    }
});

const Inventory = mongoose.model('Inventory', inventorySchema, 'inventories');
module.exports = Inventory;