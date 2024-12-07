const express = require("express");
const app = express();
const orderController = require("../controller/orders");

// Fetch Orders by User ID
app.get("/user/:userId", orderController.getOrdersByUser);

app.get("/all", orderController.getAllOrders);

app.get("/sales/total", orderController.getTotalSales);


module.exports = app;
