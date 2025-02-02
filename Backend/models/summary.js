const mongoose = require("mongoose");

const singleOrderDetail = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true
  },
  qty:{
    type:Number,required:true
  },
  sum_amt:{
    type:Number,required:true
  }
})

const SummarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    orders: [singleOrderDetail],
    order_date:{
       type: Date, 
    },
    total_amt:{
        type: Number,
    }
  }
);


const Summary = mongoose.model("Summary", SummarySchema);
module.exports = Summary;
