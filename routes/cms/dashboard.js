const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/cms/dashboardController');


router.get('/details',dashboardController.getDashboardDetails);

module.exports = router;