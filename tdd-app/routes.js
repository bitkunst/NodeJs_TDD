const express = require('express');
const router = express.Router();
const productsController = require('./controllers/products');

router.post('/', productsController.createProduct);
router.get('/', productsController.getProducts);

module.exports = router;
