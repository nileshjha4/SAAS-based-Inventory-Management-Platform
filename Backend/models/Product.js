const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    item: {
      type: String,
    },
    flavour: {
      type: String,
    },
    company: {
      type: String,
    },
    qty:{
      type: Number,
    },
    minqty: {
      type: Number,
    },
    price: {
      type: Number,
      required: true
    },
    description: String,
  }
);


const Product = mongoose.model("Inventory", ProductSchema);
module.exports = Product;
