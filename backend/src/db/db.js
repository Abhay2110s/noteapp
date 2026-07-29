const mongoose = require('mongoose');

// Use mongoose's own readyState instead of a manual module-level flag.
// Serverless functions can freeze/thaw between invocations, so a plain
// boolean can go stale; checking readyState reflects the real connection.
async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

module.exports = connectDB;
