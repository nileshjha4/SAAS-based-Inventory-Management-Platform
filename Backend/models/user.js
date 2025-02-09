const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  line1:{
    type: String
  },
  line2:{
    type:String
  },
  state:{
    type:String
  },
  pincode:{
    type:Number
  }
})

const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    sparse: true 
  },
  password: {
    type: String
  },
  number: {
    type: String
  },
  gender :{
    type: String,
    enum: ['male', 'female', 'other']
  },
  aadharcard: {
    type: String
  },
  pancard:{
    type: String
  },
  address:{
    type: addressSchema
  },
  gst:{
    type: String
  },
  pocname:{
    type: String
  },
  poccontact:{
    type: Number
  }
});

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;