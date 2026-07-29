const app = require('../src/app');
const connectDB = require('../src/db/db');
const serverless = require('serverless-http');

connectDB().catch((err) => {
    console.error('MongoDB connection failed during cold start:', err.message);
});

const handler = serverless(app);

module.exports = async (req, res) => {
    return handler(req, res);
};