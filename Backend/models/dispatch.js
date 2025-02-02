const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  agent_id : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true
  },
  loadout_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Loadout', 
    required: true
  },
  status:{
    type:String,
    enum: ['pending', 'in_progress', 'completed'],
  }
});

const Dispatch = mongoose.model("Dispatch", dispatchSchema);
module.exports = Dispatch;
