const Contract = require('../models/Contract');
const Milestone = require('../models/Milestone');

const createContract = async (req, res) => {
  try {
    const { title, description, freelancerId, amount, milestones } = req.body;
    const contract = new Contract({
      title,
      description,
      clientId: req.user.id,
      freelancerId,
      amount
    });
    await contract.save();

    if (milestones && milestones.length > 0) {
      const milestoneDocs = milestones.map(m => ({
        ...m,
        contractId: contract._id
      }));
      await Milestone.insertMany(milestoneDocs);
    }

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({
      $or: [{ clientId: req.user.id }, { freelancerId: req.user.id }]
    }).populate('clientId freelancerId', 'name email wallet');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContractDetails = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('clientId freelancerId', 'name email wallet');
    const milestones = await Milestone.find({ contractId: req.params.id }).populate('aiResult');
    res.json({ contract, milestones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMilestoneStatus = async (req, res) => {
  try {
    const { status, submissionContent } = req.body;
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.milestoneId,
      { status, submissionContent },
      { new: true }
    );
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getContracts, getContractDetails, updateMilestoneStatus };
