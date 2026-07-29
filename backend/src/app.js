const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const noteRoutes = require("./routes/notes.route");

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;