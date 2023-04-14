const express = require('express');
const router = express.Router();

const { PROJECT_NAME } = require('../../config/constants');

/* Import sub routes files */
const authRouter = require('./auth');
const adminRouter = require('./admin');

router.get('/', function (req, res) {
    res.send(`Welcome to ${PROJECT_NAME} CMS Route!`);
});

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

module.exports = router;