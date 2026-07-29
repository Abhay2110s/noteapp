const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Trust Vercel's reverse proxy so secure cookies / protocol detection work correctly
app.set('trust proxy', 1);

// Allow a comma-separated whitelist via CLIENT_URL (e.g. "https://myapp.vercel.app").
// Falls back to reflecting the request origin if CLIENT_URL is not set, so the app
// still works out of the box before you've configured env vars.
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// NOTE: do not add `app.options('*', ...)` here. Express 5's router (path-to-regexp v8)
// no longer accepts a bare '*' wildcard and throws at startup ("Missing parameter name
// at index 1: *"), which crashes the serverless function on every cold start. The
// `cors` middleware below already responds to OPTIONS preflight requests automatically.
app.use(cors(corsOptions));

// Ignore browser requests for favicons to prevent unnecessary function crashes
app.get('/favicon.png', (req, res) => res.status(204).end());
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Note App Backend is running successfully!" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoutes = require('./routes/auth.route');
const noteRoutes = require('./routes/notes.route');

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;