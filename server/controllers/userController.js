const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'student', // default if not provided
    phone,
    profile_pic,
    bio,
    subject,
    qualification,
    experience_years,
    linkedin,
    availability,
  } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0)
      return res.status(409).json({ error: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO user
        (name, email, password, role, phone, profile_pic, bio, subject, qualification, experience_years, linkedin, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      email,
      hashedPassword,
      role,
      phone || null,
      profile_pic || null,
      bio || null,
      role === 'teacher' ? subject : null,
      role === 'teacher' ? qualification : null,
      role === 'teacher' ? experience_years : null,
      role === 'teacher' ? linkedin : null,
      role === 'teacher' ? availability : null,
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};


// Login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required.' });

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token });
  });
};

module.exports = { signupUser, loginUser };
