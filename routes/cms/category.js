const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const categoryController = require('../../controllers/cms/categoryController')

router.post('/create', adminAuthCheck, categoryController.createCategory)

module.exports = router;