const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const usersRoute = require("./router/users");
const ordersRoute = require("./router/orders")
const authRouter = require("./router/auth")
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4600;
const HOST = "0.0.0.0";
main();
app.use(express.json());
app.use(cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//authentication
app.use(authRouter);

//serve pdf files
app.use('/pdfs', express.static(path.join(__dirname, 'controller', 'public', 'pdfs')));

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

// User API
app.use("/api/user", usersRoute);


// Order API
app.use("/api/orders", ordersRoute);

app.listen(PORT, HOST, async() => {
  console.log(`Listening on port ${PORT}`);
});
