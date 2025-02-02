const express = require("express");
const app = express();
const authController = require('../controller/auth')
const auth = require('../middleware/auth')

// Fetch Orders by User ID
app.post('/login', authController.login)
app.get('/get-admin', auth, authController.getAdmin)


module.exports = app;
