const mongoose = require('mongoose');

const aiResultSchema = new mongoose.Schema({
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
  quality: { type: Number, required: true }, // 0-100
  completion: { type: Number, required: true }, // 0-100
  plagiarism: { type: Number, required: true }, // 0-100
  feedback: { type: String },
  status: { 
    type: String, 
    enum: ['Recommended for Approval', 'Needs Review'], 
    default: 'Needs Review' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIResult', aiResultSchema);
