const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();


// Ignore browser requests for favicons to prevent unnecessary function crashes
app.get('/favicon.png', (req, res) => res.status(204).end());
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Add this right above or near your favicon handlers
app.get('/', (req, res) => {
    res.status(200).json({ message: "Note App Backend is running successfully!" });
});

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
    origin: true,
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