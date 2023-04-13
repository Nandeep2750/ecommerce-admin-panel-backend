const express = require('express');
const router = express.Router();
const authController = require('../../controllers/cms/authController');

router.post('/register',authController.registerAdmin);

module.exports = router;