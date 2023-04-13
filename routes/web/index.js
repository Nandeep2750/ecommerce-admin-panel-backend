const express = require('express');
const { PROJECT_NAME } = require('../../config/constants');
const router = express.Router();

router.get('/', function (req, res) {
    res.send(`Welcome to ${PROJECT_NAME} Web Route!`);
});

module.exports = router;