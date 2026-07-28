const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', verifyToken, authController.logout);

// Get Profile route
router.get('/profile', verifyToken, authController.getProfile);