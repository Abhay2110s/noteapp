const app = require('../src/app');
const connectDB = require('../src/db/db');
const serverless = require('serverless-http');

const handler = serverless(app);

module.exports = async (req, res) => {
    // Don't touch MongoDB at all for requests that never query the database.
    // These are hit constantly (favicon requests, CORS preflight) and there's
    // no reason to pay a connection cost or risk a timeout for them.
    const skipsDb = req.method === 'OPTIONS' || req.url === '/favicon.ico' || req.url === '/favicon.png';

    if (!skipsDb) {
        try {
            await connectDB();
        } catch (err) {
            console.error('MongoDB connection failed:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Database connection failed' }));
            return;
        }
    }

    return handler(req, res);
};
