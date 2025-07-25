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

// Create a course
const createCourse = (req, res) => {
  const { title, subject, description, material_url, teacher_id, access_type } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: 'teacher_id is required' });
  }

  const sql = `
    INSERT INTO courses (title, subject, description, material_url, teacher_id, access_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title || null,
      subject || null,
      description || null,
      material_url || null,
      teacher_id,
      access_type || 'free' // default to 'free' if not provided
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Course created', courseId: result.insertId });
    }
  );
};


// Fetch all courses
const getAllCourses = (req, res) => {
  const sql = 'SELECT * FROM courses';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get courses uploaded by a specific teacher
const getCoursesByTeacher = (req, res) => {
  const { teacherId } = req.params;

  const sql = 'SELECT * FROM courses WHERE teacher_id = ?';
  db.query(sql, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

//update course
const updateCourse = (req, res) => {
  const courseId = req.params.id;
  const { title, subject, description, material_url } = req.body;

  const sql = `
    UPDATE courses
    SET title = ?, subject = ?, description = ?, material_url = ?
    WHERE id = ?
  `;

  db.query(sql, [title, subject, description, material_url, courseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully' });
  });
};

// delete course
const deleteCourse = (req, res) => {
  const courseId = req.params.id;
  const sql = 'DELETE FROM courses WHERE id = ?';

  db.query(sql, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  });
};

//show specific course
const specificCourse = (req, res) => {
    const courseId = req.params.id;
    const sql = "SELECT * FROM courses WHERE id = ?";
    db.query(sql, [courseId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(result[0]);
    });
}

const enrollInCourse = (req, res) => {
  const { user_id, course_id } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ error: 'user_id and course_id are required.' });
  }

  // Check if already enrolled
  const checkSql = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(checkSql, [user_id, course_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(409).json({ error: 'User is already enrolled in this course.' });
    }

    // Enroll user
    const sql = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
    db.query(sql, [user_id, course_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Enrolled successfully' });
    });
  });
};

const getEnrolledCourses = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = `
    SELECT courses.*
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ enrolledCourses: results });
  });
};

// cancelSubscription
const cancelSubscription = (req, res) => {
  const courseId = req.params.id;
  const sql = 'DELETE FROM enrollments WHERE id = ?';

  db.query(sql, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  });
};

//deleate user
const deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM user WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};


module.exports = { signupUser, loginUser, createCourse, getAllCourses, getCoursesByTeacher, updateCourse, deleteCourse, specificCourse, enrollInCourse, getEnrolledCourses, cancelSubscription, deleteUser };