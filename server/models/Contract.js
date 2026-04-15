const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true }, // Total ETH amount
  status: { 
    type: String, 
    enum: ['pending', 'locked', 'active', 'complete', 'disputed', 'cancelled'], 
    default: 'locked' 
  },
  onChainId: { type: String }, // Transaction hash or contract index
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
