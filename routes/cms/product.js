const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const productController = require('../../controllers/cms/productController')

router.post('/create', adminAuthCheck, productController.createProduct)
router.post('/paginate-list', adminAuthCheck, productController.getPaginateProductsList)
router.put('/update', adminAuthCheck, productController.updateProduct)

module.exports = router;