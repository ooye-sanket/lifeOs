const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const auth = require('../middleware/auth');

router.get('/', auth, checkInController.getCheckIns);
router.post('/', auth, checkInController.createCheckIn);
router.get('/weekly-summary', auth, checkInController.getWeeklySummary);

module.exports = router;