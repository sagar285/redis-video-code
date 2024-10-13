const express = require('express');
const ProductRouter = express.Router();

const { createProduct, getProductById, deleteProductById, getAllProducts } = require('../controller/Product');

ProductRouter.post('/', createProduct);
ProductRouter.get('/:id', getProductById);
ProductRouter.delete('/:id', deleteProductById);
ProductRouter.get('/', getAllProducts);

module.exports = ProductRouter;