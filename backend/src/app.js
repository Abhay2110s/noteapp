const express = require('express');
const app = express();

// Middleware
app.use(express.json());

module.exports = app;