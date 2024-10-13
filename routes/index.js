const express = require('express');
const ProductRouter = require('./Product');
const CategoryRouter = require('./Cateogory');
const router = express.Router();

router.use('/product', ProductRouter);
router.use('/category', CategoryRouter);

module.exports = router;