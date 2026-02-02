const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - allow requests from your Vercel client domain
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL || "https://your-app.vercel.app", // Update this after deployment
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Mentora API is running!" });
});

// Export the Express app for Vercel serverless
module.exports = app;
