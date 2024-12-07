const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    flavor: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    minqty: {
      type: Number,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String,
  },
  { timestamps: true }
);


const Product = mongoose.model("Inventory", ProductSchema, "Inventory");
module.exports = Product;
