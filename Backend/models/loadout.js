const mongoose = require('mongoose');

const loadoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  order_id : {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Orders',
  },
  agentAssign : {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Loadout = mongoose.model("Loadout", loadoutSchema);
module.exports = Loadout;
