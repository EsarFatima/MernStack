const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  power: {
    type: String,
    default: ''
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Creature', creatureSchema);
