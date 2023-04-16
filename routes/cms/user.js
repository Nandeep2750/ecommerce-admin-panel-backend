const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const userController = require('../../controllers/cms/userController')

router.post('/list', adminAuthCheck, userController.getUserList);
router.get('/list-all', adminAuthCheck, userController.getAllUserList);
router.get('/details-by-id', adminAuthCheck, userController.getUserByID);
router.post('/create', adminAuthCheck, userController.createUser);
router.put('/edit', adminAuthCheck, userController.updateUser);
router.post('/active-inactive', adminAuthCheck, userController.activeInactiveUser);

module.exports = router;