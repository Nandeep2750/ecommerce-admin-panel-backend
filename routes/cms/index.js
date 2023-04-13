const express = require('express');
const router = express.Router();

const { PROJECT_NAME } = require('../../config/constants');


router.get('/', function (req, res) {
    res.send(`Welcome to ${PROJECT_NAME} CMS Route!`);
});

module.exports = router;