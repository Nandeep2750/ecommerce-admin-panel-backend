const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const productController = require('../../controllers/cms/productController')

router.post('/create', adminAuthCheck, productController.createProduct)
router.post('/list', adminAuthCheck, productController.getPaginateProductsList)
router.get('/details-by-id', adminAuthCheck, productController.getProductByID);
router.put('/edit', adminAuthCheck, productController.updateProduct)
router.delete('/delete', adminAuthCheck, productController.deleteProduct)

module.exports = router;