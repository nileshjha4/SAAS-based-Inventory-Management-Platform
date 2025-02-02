const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String
  },
  agentname: {
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
  availabilityStatus: {
    type: String,
    required: true,
    enum: ['Available', 'Busy', 'Off Duty'],
    default: 'Available',
  },
  aadharcard: {
    type: String
  },
  pancard:{
    type: String
  }
});

const Agent = mongoose.model("Agent", agentSchema);
module.exports = Agent;
