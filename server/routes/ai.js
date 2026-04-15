const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { analyzeWork } = require('../controllers/aiController');

router.post('/analyze', auth, analyzeWork);

module.exports = router;
