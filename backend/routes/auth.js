const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/create-pin', authController.createPin);
router.post('/login', authController.login);
router.get('/check-pin', authController.checkPin);

module.exports = router;