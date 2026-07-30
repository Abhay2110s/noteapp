const mongoose = require('mongoose');

// Use mongoose's own readyState instead of a manual module-level flag.
// Serverless functions can freeze/thaw between invocations, so a plain
// boolean can go stale; checking readyState reflects the real connection.
async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Fail fast instead of the driver's default 30s hang, so errors
            // surface quickly and clearly instead of silently timing out.
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 20000,
        });
        console.log('MongoDB connected');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

module.exports = connectDB;
