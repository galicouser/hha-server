const express = require("express");
require("dotenv").config();
const router = express.Router();
const { getAllProducts, getProductById, addProduct, editProduct,editProductData, deleteProduct } = require('../controller/products'); 

router.get('/', getAllProducts);
router.get('/get-product-id/', getProductById);
router.post('/add-product', addProduct);
router.post('/edit-product', editProduct);
router.post('/edit-product-data', editProductData);
router.post('/delete-product', deleteProduct);

module.exports = router;