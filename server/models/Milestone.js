const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'submitted', 'approved', 'disputed'], 
    default: 'pending' 
  },
  submissionContent: { type: String }, // Freelancer's submitted work (link or text)
  aiResult: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResult' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Milestone', milestoneSchema);
