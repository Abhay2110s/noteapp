const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.route');
const noteRoutes = require('./routes/notes.route');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Middleware
app.use(express.json());


module.exports = app;