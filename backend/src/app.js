const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.route');

// Routes
app.use('/api/auth', authRoutes);

// Middleware
app.use(express.json());


module.exports = app;