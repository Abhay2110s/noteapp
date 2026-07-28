const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

let isConnected = false;

async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}

module.exports = handler;

if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  });
}
