require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 5000;

// This file is only used for local development. On Vercel, api/index.js is the
// serverless entry point and this file is never executed.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
