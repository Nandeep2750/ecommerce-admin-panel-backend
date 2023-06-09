const express = require('express');
const router = express.Router();
const authController = require('../../controllers/cms/authController');

router.post('/register',authController.registerAdmin);
router.post('/login',authController.loginAdmin);
router.post('/refresh-token',authController.refreshToken);

module.exports = router;