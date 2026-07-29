const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://noteapp-m521.vercel.app' : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://noteapp-m521.vercel.app' : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoutes = require('./routes/auth.route');
const noteRoutes = require('./routes/notes.route');

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;