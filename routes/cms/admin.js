const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");


/* ---------- controllers ---------- */
const adminController = require('../../controllers/cms/adminController')

router.put('/change-password', adminAuthCheck, adminController.changePassword)
router.put('/update-profile', adminAuthCheck, adminController.updateProfile);


module.exports = router;