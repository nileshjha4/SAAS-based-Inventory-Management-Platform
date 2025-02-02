const mongoose = require('mongoose');

// Define the schema for the address object
const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

// Define the main schema for the user
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: addressSchema, required: true },
  shopname: { type: String, required: true },
  pancard: { type: String, required: true },
  aadharcard: { type: String, required: true },
  gst: { type: String, required: true },
  pocname: { type: String, required: true },
  poccontact: { type: String, required: true }
}, { timestamps: true }); // To auto-generate createdAt and updatedAt timestamps

// Create the User model with the schema
const User = mongoose.model('Users', userSchema, "Users");

module.exports = User;
