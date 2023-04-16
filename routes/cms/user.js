const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const userController = require('../../controllers/cms/userController')

router.post('/list', adminAuthCheck, userController.getUserList);
router.get('/details-by-id', adminAuthCheck, userController.getUserByID);
router.post('/create', adminAuthCheck, userController.createUser);
router.post('/active-inactive', adminAuthCheck, userController.activeInactiveUser);

module.exports = router;