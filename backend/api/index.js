const app = require("../src/app");
const connectDB = require("../src/db/db");
const serverless = require("serverless-http");

let connected = false;

async function ensureDB() {
  if (!connected) {
    await connectDB();
    connected = true;
  }
}

const handler = serverless(app);

module.exports = async (req, res) => {
  await ensureDB();
  return handler(req, res);
};