const mongoose = require('mongoose');

// Cache the connection PROMISE (not just a boolean) in the Node module cache.
// On a warm serverless invocation, Node reuses this same module instance, so
// this promise survives between requests and lets every call share one
// in-flight connection attempt instead of racing to open several at once.
let connectionPromise = null;

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URI, {
                // Fail fast instead of hanging until Vercel kills the function.
                serverSelectionTimeoutMS: 8000,
                socketTimeoutMS: 20000,
                // A single connection is enough per serverless instance; a
                // large pool just adds overhead that's never used.
                maxPoolSize: 5,
            })
            .then((conn) => {
                console.log('MongoDB connected');
                return conn;
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error.message);
                // Reset so the next request can try again instead of being
                // stuck reusing a rejected promise forever.
                connectionPromise = null;
                throw error;
            });
    }

    return connectionPromise;
}

module.exports = connectDB;
