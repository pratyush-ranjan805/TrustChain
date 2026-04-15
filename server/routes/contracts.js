const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createContract, 
  getContracts, 
  getContractDetails, 
  updateMilestoneStatus 
} = require('../controllers/contractController');

router.post('/', auth, createContract);
router.get('/', auth, getContracts);
router.get('/:id', auth, getContractDetails);
router.patch('/milestones/:milestoneId', auth, updateMilestoneStatus);

module.exports = router;
