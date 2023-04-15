const express = require('express');
const router = express.Router();

const { PROJECT_NAME } = require('../../config/constants');

/* Import sub routes files */
const authRouter = require('./auth');
const adminRouter = require('./admin');
const userRouter = require('./user');
const categoryRouter = require('./category');
const productRouter = require('./product');

router.get('/', function (req, res) {
    res.send(`Welcome to ${PROJECT_NAME} CMS Route!`);
});

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);

module.exports = router;