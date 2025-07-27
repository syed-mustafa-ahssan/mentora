const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'student',
    phone,
    profile_pic,
    bio,
    subject,
    qualification,
    experience_years,
    linkedin,
    availability,
    location,
    created_at
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
        (name, email, password, role, phone, profile_pic, bio, subject, qualification, experience_years, linkedin, availability, location, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      location || null,
      created_at || new Date()
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

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Include role in JWT payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      id: user.id,
      role: user.role, // Include role in response
    });
  });
};

const createCourse = (req, res) => {
  const {
    title,
    subject,
    description,
    material_url,
    teacher_id,
    access_type,
    price,
    thumbnail,
    level,        // Added level
    duration,     // Added duration
  } = req.body;

  // Basic validation
  if (!teacher_id) {
    return res.status(400).json({ error: 'teacher_id is required' });
  }

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  // Step 1: Get instructor name from user table
  const getInstructorSql = 'SELECT name FROM user WHERE id = ?';
  db.query(getInstructorSql, [teacher_id], (err, userResult) => {
    if (err) return res.status(500).json({ error: err.message });

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const instructor_name = userResult[0].name;

    // Step 2: Insert the course
    const insertSql = `
      INSERT INTO courses (
        title,
        subject,
        description,
        material_url,
        teacher_id,
        access_type,
        price,
        thumbnail,
        instructor_name,
        level,
        duration
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        title || null,
        subject || null,
        description || null,
        material_url || null,
        teacher_id,
        access_type || 'free',
        price || null,
        thumbnail || null,
        instructor_name,
        level || null,    // Use level from req.body or null
        duration || null  // Use duration from req.body or null
      ],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Course created', courseId: result.insertId });
      }
    );
  });
};

// Fetch all courses (only active ones)
const getAllCourses = (req, res) => {
  // Consider adding pagination, filtering, and sorting in the future
  const sql = 'SELECT * FROM courses WHERE is_active = 1';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get courses uploaded by a specific teacher (only active ones)
const getCoursesByTeacher = (req, res) => {
  const { teacherId } = req.params;
  // Optionally filter by status (e.g., published)
  const sql = 'SELECT * FROM courses WHERE teacher_id = ? AND is_active = 1';
  db.query(sql, [teacherId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Update course
const updateCourse = (req, res) => {
  const courseId = req.params.id;
  const {
    title,
    subject,
    description,
    material_url,
    access_type,
    price,
    thumbnail,
    level,
    duration,
    category_id,
    status,
    is_active
  } = req.body;

  // Build dynamic update query to only update provided fields
  const fields = [];
  const values = [];

  if (title !== undefined) { fields.push('title = ?'); values.push(title); }
  if (subject !== undefined) { fields.push('subject = ?'); values.push(subject); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description); }
  if (material_url !== undefined) { fields.push('material_url = ?'); values.push(material_url); }
  if (access_type !== undefined) { fields.push('access_type = ?'); values.push(access_type); }
  if (price !== undefined) { fields.push('price = ?'); values.push(price); }
  if (thumbnail !== undefined) { fields.push('thumbnail = ?'); values.push(thumbnail); }
  if (level !== undefined) { fields.push('level = ?'); values.push(level); }
  if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
  if (category_id !== undefined) { fields.push('category_id = ?'); values.push(category_id); }
  if (status !== undefined) { fields.push('status = ?'); values.push(status); }
  if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active); }

  // Always update the updated_at timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');

  if (fields.length === 1) { // Only updated_at would be updated
    return res.status(400).json({ error: 'No fields to update' });
  }

  const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`;
  values.push(courseId);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course updated successfully' });
  });
};

// Delete course (soft delete)
const deleteCourse = (req, res) => {
  const courseId = req.params.id;
  // Soft delete: Mark as inactive and archived
  const sql = 'UPDATE courses SET is_active = 0, status = "archived" WHERE id = ?';

  db.query(sql, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course archived successfully' });
  });
};

// Show specific course (only if active)
const specificCourse = (req, res) => {
  const courseId = req.params.id;
  const sql = "SELECT * FROM courses WHERE id = ? AND is_active = 1";
  db.query(sql, [courseId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(404).json({ error: 'Course not found or inactive' });
    }
    res.json(result[0]);
  });
};

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

// extra function
const isUserEnrolled = (req, res) => {
  const userId = req.user?.id; // Assuming you have middleware to attach user info from JWT
  const { courseId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required.' });
  }

  const sql = 'SELECT 1 FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1';
  db.query(sql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("Database error checking enrollment:", err);
      return res.status(500).json({ error: 'Failed to check enrollment status.' });
    }
    const isEnrolled = results.length > 0;
    res.json({ isEnrolled });
  });
};

// cancelSubscription
const cancelSubscription = (req, res) => {
  const { user_id, course_id } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ error: 'user_id and course_id are required' });
  }

  const sql = 'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(sql, [user_id, course_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.json({ message: 'Successfully unenrolled from course' });
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

// controllers/userController.js

// --- Add this utility function ---
const extractUserIdFromToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set
    return decoded.id; // Assuming your token payload has 'id'
  } catch (err) {
    console.error("Token verification failed:", err);
    return null; // Invalid token
  }
};

// --- Controller function to get user profile ---
// const getUserProfile = (req, res) => {
//   // 1. Get the target user ID from the URL parameter
//   const targetUserId = req.params.userId;

//   // 2. Basic validation
//   if (!targetUserId) {
//      return res.status(400).json({ error: 'User ID is required.' });
//   }

//   // 3. Proceed with fetching the profile
//   // Select all relevant fields, explicitly excluding password
//   const sql = `
//     SELECT id, name, email, role, phone, profile_pic, bio, subject, qualification,
//            experience_years, linkedin, availability, location, created_at
//     FROM user
//     WHERE id = ?
//   `;

//   db.query(sql, [targetUserId], (err, results) => {
//     if (err) {
//       console.error("Database error fetching user profile:", err);
//       return res.status(500).json({ error: 'Failed to fetch profile.' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     const user = results[0];
//     res.json(user); // Send the user object directly
//   });
// };
// controllers/userController.js
const getUserProfile = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const sql = `SELECT * FROM user WHERE id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    delete user.password; // remove sensitive data
    res.json(user);
  });
};


//profile update
const updateProfile = (req, res) => {
  const userIdFromParams = req.params.id; // Get ID from URL parameter
  const requestingUserId = extractUserIdFromToken(req); // Get ID from token

  if (!requestingUserId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (requestingUserId !== parseInt(userIdFromParams, 10)) {
    return res.status(403).json({ error: 'Access denied. You can only update your own profile.' });
  }

  const userId = userIdFromParams; // Use the validated ID

  const {
    name, email, phone, profile_pic, bio,
    subject, qualification, experience_years, linkedin, availability, location
  } = req.body;

  // Build dynamic update query
  const fields = [];
  const values = [];

  if (name !== undefined) { fields.push('name = ?'); values.push(name); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
  if (profile_pic !== undefined) { fields.push('profile_pic = ?'); values.push(profile_pic); }
  if (bio !== undefined) { fields.push('bio = ?'); values.push(bio); }
  if (subject !== undefined) { fields.push('subject = ?'); values.push(subject); }
  if (qualification !== undefined) { fields.push('qualification = ?'); values.push(qualification); }
  // Handle experience_years: allow null, convert string number to int
  if (experience_years !== undefined) {
    const expValue = experience_years === '' || experience_years === null ? null : parseInt(experience_years, 10);
    fields.push('experience_years = ?');
    values.push(expValue);
  }
  if (linkedin !== undefined) { fields.push('linkedin = ?'); values.push(linkedin); }
  if (availability !== undefined) { fields.push('availability = ?'); values.push(availability); }
  if (location !== undefined) { fields.push('location = ?'); values.push(location); }

  // Ensure at least one field is being updated (excluding the WHERE clause)
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  const sql = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;
  values.push(userId); // Add user ID for WHERE clause

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error updating profile:", err);
      // Handle specific errors like duplicate email if needed
      return res.status(500).json({ error: 'Failed to update profile.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
};

// Change Password
const changePassword = (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Step 1: Get user from DB
  db.query('SELECT * FROM user WHERE id = ?', [userId], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];

    // Step 2: Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Step 3: Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.query(
      'UPDATE user SET password = ? WHERE id = ?',
      [hashedNewPassword, userId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Password changed successfully' });
      }
    );
  });
};

const getAllUsersForAdmin = (req, res) => {
  // 1. Extract User ID from the request token (assuming middleware or utility like updateProfile)
  const requestingUserId = extractUserIdFromToken(req);

  if (!requestingUserId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // 2. Check if the requesting user exists and get their role from the database
  const checkUserRoleSql = 'SELECT role FROM user WHERE id = ?';
  db.query(checkUserRoleSql, [requestingUserId], (err, results) => {
    if (err) {
      console.error("Database error checking user role:", err);
      return res.status(500).json({ error: 'Failed to verify admin status.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' }); // Shouldn't happen if token is valid
    }

    const userRole = results[0].role;

    // 3. Authorize: Check if the user's role is 'admin'
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // 4. Authorized: Fetch all users (excluding passwords)
    const getAllUsersSql = `
      SELECT id, name, email, role, phone, profile_pic, bio, subject, qualification,
             experience_years, linkedin, availability, location, created_at
      FROM user
      ORDER BY created_at DESC
    `; // Optional: Add ORDER BY, LIMIT, OFFSET for pagination/search later

    db.query(getAllUsersSql, (err, users) => {
      if (err) {
        console.error("Database error fetching all users:", err);
        return res.status(500).json({ error: 'Failed to fetch users.' });
      }

      res.json({ users });
    });
  });
};
const deleteCoursesByTeacher = (req, res) => {
  // 1. Extract User ID (Admin) from the request token
  const adminUserId = extractUserIdFromToken(req);
  if (!adminUserId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // 2. Get the target teacher's user ID from the request parameters
  const targetTeacherId = req.params.teacherId;

  if (!targetTeacherId) {
    return res.status(400).json({ error: 'Teacher ID is required.' });
  }

  // 3. Check if the requesting user (Admin) exists and get their role
  const checkAdminRoleSql = 'SELECT role FROM user WHERE id = ?';
  db.query(checkAdminRoleSql, [adminUserId], (err, results) => {
    if (err) {
      console.error("Database error checking admin role:", err);
      return res.status(500).json({ error: 'Failed to verify admin status.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Admin user not found.' });
    }

    const adminRole = results[0].role;

    // 4. Authorize: Check if the requesting user's role is 'admin'
    if (adminRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // 5. Authorized Admin: Proceed to delete courses by the target teacher ID
    // IMPORTANT: Consider implications. Deleting courses might affect enrolled students.
    // You might want to soft-delete or handle enrollments first.
    // For now, this will perform a hard delete.

    // First, delete related enrollments (optional, but good practice)
    const deleteEnrollmentsSql = 'DELETE e FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.teacher_id = ?';
    db.query(deleteEnrollmentsSql, [targetTeacherId], (errEnrollments) => {
      if (errEnrollments) {
        console.error("Database error deleting enrollments for teacher's courses:", errEnrollments);
        // Depending on requirements, you might want to return an error here
        // or continue deleting courses even if enrollments deletion fails.
        // For robustness, let's log it but attempt to delete courses anyway.
        // return res.status(500).json({ error: 'Failed to delete related enrollments.' });
      }
      // Then, delete the courses themselves
      const deleteCoursesSql = 'DELETE FROM courses WHERE teacher_id = ?';
      db.query(deleteCoursesSql, [targetTeacherId], (errCourses, resultCourses) => {
        if (errCourses) {
          console.error("Database error deleting courses:", errCourses);
          return res.status(500).json({ error: 'Failed to delete courses.' });
        }

        // Respond with the number of courses deleted
        res.json({ message: `Successfully deleted ${resultCourses.affectedRows} course(s) for teacher ID ${targetTeacherId}.` });
      });
    });
  });
};

// --- Controller function to GET all courses BY a specific teacher (Admin/Teacher/User) ---
// Useful for the admin to see what will be deleted
const getCoursesByTeacherForAdmin = (req, res) => {
  // 1. Extract User ID (Admin) from the request token
  const requestingUserId = extractUserIdFromToken(req);
  if (!requestingUserId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // 2. Get the target teacher's user ID from the request parameters
  const targetTeacherId = req.params.teacherId;

  if (!targetTeacherId) {
    return res.status(400).json({ error: 'Teacher ID is required.' });
  }

  // 3. Check if the requesting user exists and get their role (Authorization check)
  const checkUserRoleSql = 'SELECT role FROM user WHERE id = ?';
  db.query(checkUserRoleSql, [requestingUserId], (err, results) => {
    if (err) {
      console.error("Database error checking user role:", err);
      return res.status(500).json({ error: 'Failed to verify access status.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Requesting user not found.' });
    }

    const userRole = results[0].role;

    // 4. Authorize: Check if the requesting user's role is 'admin' OR they are the teacher themselves
    if (userRole !== 'admin' && parseInt(requestingUserId) !== parseInt(targetTeacherId)) {
      return res.status(403).json({ error: 'Access denied. Admins or the teacher themselves only.' });
    }

    // 5. Authorized: Fetch courses by the target teacher ID
    const sql = `
      SELECT id, title, subject, description, material_url, teacher_id, access_type, price, thumbnail, level, duration, created_at, updated_at, is_active, status
      FROM courses
      WHERE teacher_id = ?
      ORDER BY created_at DESC
    `;

    db.query(sql, [targetTeacherId], (err, courses) => {
      if (err) {
        console.error("Database error fetching courses by teacher:", err);
        return res.status(500).json({ error: 'Failed to fetch courses.' });
      }

      res.json({ courses });
    });
  });
};

module.exports = { signupUser, loginUser, createCourse, getAllCourses, getCoursesByTeacher, updateCourse, deleteCourse, specificCourse, enrollInCourse, getEnrolledCourses, cancelSubscription, deleteUser, updateProfile, changePassword, isUserEnrolled, getUserProfile, getAllUsersForAdmin, deleteCoursesByTeacher, getCoursesByTeacherForAdmin };