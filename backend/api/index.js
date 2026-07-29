const app = require('../src/app');
const connectDB = require('../src/db/db');
const serverless = require('serverless-http');

const handler = serverless(app);

module.exports = async (req, res) => {
    try {
        // connectDB() is a no-op if already connected (checks readyState),
        // so this stays fast on warm invocations and only pays the connect
        // cost on a cold start or after a dropped connection.
        await connectDB();
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Database connection failed' }));
        return;
    }

    return handler(req, res);
};
