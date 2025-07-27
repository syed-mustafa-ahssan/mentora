// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path if your config/db is located elsewhere
const jwt = require('jsonwebtoken');

// --- Middleware to verify Admin Token ---
const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    // Check if the user's role is 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    req.user = decoded; // Attach user info (id, email, role) to request object
    next();
  });
};

// --- Get All Users (Admin Only) ---
router.get('/users', authenticateAdminToken, (req, res) => {
  const sql = `
    SELECT id, name, email, role, phone, profile_pic, bio, subject, qualification,
           experience_years, linkedin, availability, location, created_at
    FROM user
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error fetching users:", err);
      return res.status(500).json({ error: 'Failed to fetch users.' });
    }
    res.json({ users: results });
  });
});

// --- Get Specific User by ID (Admin Only) ---
router.get('/users/:id', authenticateAdminToken, (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT id, name, email, role, phone, profile_pic, bio, subject, qualification,
           experience_years, linkedin, availability, location, created_at
    FROM user WHERE id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database error fetching user:", err);
      return res.status(500).json({ error: 'Failed to fetch user.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(results[0]);
  });
});

// --- Delete User (Admin Only) ---
// Re-use the existing controller logic (assuming it's exported from the controller file)
// Make sure the deleteUser function is correctly exported from your controller file.
const { deleteUser } = require('../controllers/Controller'); // Adjust path if needed
// If your controller file is structured differently or the deleteUser function isn't exported correctly,
// you might need to import it differently or redefine it here.
// For example, if it's in the same file as other controllers that are exported from './routes/userRoutes',
// you might need to adjust the path or how it's imported.

router.delete('/users/:id', authenticateAdminToken, deleteUser);

// --- Example: Get All Courses (Admin Only) ---
// You can add more admin-specific endpoints here, like managing courses.
// router.get('/courses', authenticateAdminToken, (req, res) => {
//   const sql = 'SELECT * FROM courses'; // Get all, including inactive
//    db.query(sql, (err, results) => {
//      if (err) {
//        console.error("Database error fetching courses:", err);
//        return res.status(500).json({ error: 'Failed to fetch courses.' });
//      }
//      res.json({ courses: results });
//    });
// });

module.exports = router;