const express = require("express");
const app = express();
const user = require("../controller/users");

// Search Users
app.get("/search", user.searchUsers); 

// Get All Users
app.get("/get/all", user.getAllUsers);

app.post("/update", user.updateSelectedUser);

module.exports = app;
