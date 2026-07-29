const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    } 
}

module.exports = connectDB;