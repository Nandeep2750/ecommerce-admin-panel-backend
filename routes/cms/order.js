const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const orderController = require('../../controllers/cms/orderController')

router.post('/create', adminAuthCheck, orderController.createOrder)
router.post('/list', adminAuthCheck, orderController.getOrdersList)

module.exports = router;