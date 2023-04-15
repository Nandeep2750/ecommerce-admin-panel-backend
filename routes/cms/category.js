const express = require('express');
const router = express.Router();

/* ---------- middleware ---------- */
const adminAuthCheck = require("../../middleware/cms/admin-auth-check");

/* ---------- controllers ---------- */
const categoryController = require('../../controllers/cms/categoryController')

router.post('/create', adminAuthCheck, categoryController.createCategory)
router.post('/paginate-list', adminAuthCheck, categoryController.getPaginateCategoriesList)
router.get('/list', adminAuthCheck, categoryController.getCategoriesList)
router.delete('/delete', adminAuthCheck, categoryController.deleteCategory)

module.exports = router;