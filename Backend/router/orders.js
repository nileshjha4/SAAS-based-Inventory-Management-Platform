const express = require("express");
const app = express();
const orderController = require("../controller/orders");

// Fetch Orders by User ID
app.get("/user/:userId", orderController.getOrdersByUser);

app.get("/all", orderController.getAllOrders);

app.get("/loadout-name", orderController.getLoadoutName);

app.post('/update-loadout', orderController.updateLoadout)

app.get("/sales/total", orderController.getTotalSales);

app.get('/get-loadout', orderController.getAllLoadouts)

app.post('/delete-loadout', orderController.deleteLoadout)

app.get('/get-agent', orderController.getAgent)

app.post('/assign-agent', orderController.assignAgent)

app.get('/get-dispatch', orderController.getDispatch)

app.post('/generate-loadout-pdf', orderController.generateLoadoutPdf)

app.post('/generate-pre-bill-invoice', orderController.generatePreBillInvoice)

app.post('/settle-dispatch', orderController.settleDispatch)

app.get('/get-summary', orderController.getSummary)

app.post('/generate-post-bill-invoice', orderController.generatePostBillInvoice)

module.exports = app;
