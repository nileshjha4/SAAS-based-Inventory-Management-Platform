const express = require("express");
const app = express();
const product = require("../controller/product");

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.get("/get/all", product.getAllProducts);

// Delete Selected Product Item
app.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
app.post("/update", product.updateSelectedProduct);

// Search Product
app.get("/search", product.searchProduct);

app.post('/generate-coupon', product.generateCoupon)

app.get('/get-coupon', product.getCoupon)

// http://103.160.144.19:4600/api/product/search?searchTerm=fa

module.exports = app;
