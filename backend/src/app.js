const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// 1. Enable CORS for your frontend deployment
app.use(cors({
    origin: 'https://noteapp-m521.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Explicitly handle preflight requests
app.options('*', cors({
    origin: 'https://noteapp-m521.vercel.app',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ... rest of your routes (authRoute, notesRoute, etc.)

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;