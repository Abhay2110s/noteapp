const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

// Use serverless-http to adapt the Express app into a serverless handler
const serverless = require('serverless-http');
let dbConnected = false;

async function ensureDB() {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
}

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await ensureDB();
    return handler(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
