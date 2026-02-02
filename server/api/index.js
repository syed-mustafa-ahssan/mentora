const express = require("express");
require("dotenv").config();
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const corsMiddleware = require("../middleware/cors");
const errorHandler = require("../middleware/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(corsMiddleware);
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

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Export the Express app for Vercel serverless
module.exports = app;

