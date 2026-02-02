const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - allow all origins in production for now
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);

app.use(express.json());

// Root route - Hello World
app.get("/", (req, res) => {
  res.json({
    message: "Hello World! Welcome to Mentora API",
    status: "running",
    endpoints: {
      health: "/api",
      users: "/api/users/*"
    }
  });
});

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Mentora API is running!" });
});

app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Export the Express app for Vercel serverless
module.exports = app;

