const mongoose = require('mongoose');

// Define the schema for each order item
const orderItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true }, 
  qty: { type: Number, required: true }, // Quantity of the item
  sum_amt: { type: Number, required: true }, // Total amount for this item
  discount_amt: { type: Number }, // Discount amount
  discount_percentage: { type: Number } // Discount percentage
});

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Reference to the user
  order: { type: [orderItemSchema] }, // Array of items in the order
  status: { 
    type: String, 
    enum: ['Cancelled', 'Orders', 'LoadOut', 'Dispatch', 'Delivered'], // Possible order statuses
    required: true
  }
}, { timestamps: true }); // Automatically includes createdAt and updatedAt fields

// Create the Order model
const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;
