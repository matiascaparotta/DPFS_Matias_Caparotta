// routes/productRoutesApi.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.listProductsApi);
router.get('/:id', productController.getProductDetailApi);

module.exports = router;