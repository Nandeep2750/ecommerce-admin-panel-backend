const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const productController = require('../../controllers/cms/productController')

router.post('/create', adminAuthCheck, productController.createProduct)

module.exports = router;