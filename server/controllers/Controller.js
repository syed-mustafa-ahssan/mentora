const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Signup
const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      phone,
      profile_pic,
      bio,
      subject,
      qualification,
      experience_years,
      linkedin,
      availability,
      location,
      created_at,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      profile_pic,
      bio,
      subject: role === "teacher" ? subject : undefined,
      qualification: role === "teacher" ? qualification : undefined,
      experience_years: role === "teacher" ? experience_years : undefined,
      linkedin: role === "teacher" ? linkedin : undefined,
      availability: role === "teacher" ? availability : undefined,
      location,
      created_at: created_at || new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in signupUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      id: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create Course
const createCourse = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      material_url,
      teacher_id,
      access_type,
      price,
      thumbnail,
      level,
      duration,
      learningOutcomes,
      prerequisites,
      modules,
      language,
    } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ error: "teacher_id is required" });
    }

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    // Get instructor name from user
    const teacher = await User.findById(teacher_id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const newCourse = new Course({
      title,
      subject,
      description,
      material_url,
      teacher_id,
      instructor_name: teacher.name,
      access_type: access_type || "free",
      price,
      thumbnail,
      level,
      duration,
      learningOutcomes: learningOutcomes || [],
      prerequisites: prerequisites || [],
      modules: modules || [],
      language: language || 'English',
      rating: 0,
      total_ratings: 0,
    });

    await newCourse.save();
    res.status(201).json({
      message: "Course created",
      courseId: newCourse._id,
    });
  } catch (err) {
    console.error("Error in createCourse:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all courses (only active ones)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ is_active: true });

    // Convert MongoDB documents to plain objects with 'id' field for frontend compatibility
    const coursesWithId = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.id = courseObj._id;
      return courseObj;
    });

    res.json(coursesWithId);
  } catch (err) {
    console.error("Error in getAllCourses:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get courses by teacher (only active ones)
const getCoursesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const courses = await Course.find({ teacher_id: teacherId, is_active: true });

    // Convert MongoDB documents to plain objects with 'id' field
    const coursesWithId = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.id = courseObj._id;
      return courseObj;
    });

    res.json(coursesWithId);
  } catch (err) {
    console.error("Error in getCoursesByTeacher:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
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
      is_active,
      learningOutcomes,
      prerequisites,
      modules,
      language,
      rating,
      total_ratings,
    } = req.body;

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (subject !== undefined) updateFields.subject = subject;
    if (description !== undefined) updateFields.description = description;
    if (material_url !== undefined) updateFields.material_url = material_url;
    if (access_type !== undefined) updateFields.access_type = access_type;
    if (price !== undefined) updateFields.price = price;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;
    if (level !== undefined) updateFields.level = level;
    if (duration !== undefined) updateFields.duration = duration;
    if (category_id !== undefined) updateFields.category_id = category_id;
    if (status !== undefined) updateFields.status = status;
    if (is_active !== undefined) updateFields.is_active = is_active;
    if (learningOutcomes !== undefined) updateFields.learningOutcomes = learningOutcomes;
    if (prerequisites !== undefined) updateFields.prerequisites = prerequisites;
    if (modules !== undefined) updateFields.modules = modules;
    if (language !== undefined) updateFields.language = language;
    if (rating !== undefined) updateFields.rating = rating;
    if (total_ratings !== undefined) updateFields.total_ratings = total_ratings;

    updateFields.updated_at = new Date();

    if (Object.keys(updateFields).length === 1) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Error in updateCourse:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete course (soft delete)
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { is_active: false, status: "archived" },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course archived successfully" });
  } catch (err) {
    console.error("Error in deleteCourse:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get specific course (only if active) with comprehensive details
const specificCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const course = await Course.findOne({ _id: courseId, is_active: true })
      .populate('teacher_id', 'name email profile_pic bio qualification experience_years linkedin');

    if (!course) {
      return res.status(404).json({ error: "Course not found or inactive" });
    }

    // Get enrollment count for this course
    const enrollmentCount = await Enrollment.countDocuments({ course_id: courseId });

    // Get total students taught by this instructor (across all their courses)
    const instructorCourses = await Course.find({
      teacher_id: course.teacher_id._id,
      is_active: true
    });

    const instructorCourseIds = instructorCourses.map(c => c._id);
    const totalStudentsTaught = await Enrollment.countDocuments({
      course_id: { $in: instructorCourseIds }
    });

    // Calculate average rating for instructor's courses
    const instructorCoursesWithRatings = instructorCourses.filter(c => c.total_ratings > 0);
    const instructorAvgRating = instructorCoursesWithRatings.length > 0
      ? instructorCoursesWithRatings.reduce((sum, c) => sum + c.rating, 0) / instructorCoursesWithRatings.length
      : 0;

    // Convert to plain object with 'id' field
    const courseObj = course.toObject();
    courseObj.id = courseObj._id;

    // Add computed fields
    courseObj.enrollment_count = enrollmentCount;

    // Add instructor information
    courseObj.instructorInfo = {
      name: course.teacher_id.name,
      email: course.teacher_id.email,
      bio: course.teacher_id.bio || "Experienced instructor passionate about teaching.",
      profile_pic: course.teacher_id.profile_pic || null,
      qualification: course.teacher_id.qualification || "Professional Educator",
      experience_years: course.teacher_id.experience_years || 0,
      linkedin: course.teacher_id.linkedin || null,
      rating: parseFloat(instructorAvgRating.toFixed(1)),
      totalStudents: totalStudentsTaught,
      totalCourses: instructorCourses.length,
      avatar: course.teacher_id.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher_id.name)}&background=4f46e5&color=fff&size=100`
    };

    res.json(courseObj);
  } catch (err) {
    console.error("Error in specificCourse:", err);
    res.status(500).json({ error: err.message });
  }
};

// Enroll in course
const enrollInCourse = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res
        .status(400)
        .json({ error: "user_id and course_id are required." });
    }

    // Validate ObjectIds - must be 24 character hex strings
    const isValidObjectId = (id) => {
      if (typeof id !== 'string') return false;
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    if (!isValidObjectId(user_id)) {
      return res.status(400).json({
        error: "Invalid user_id format. Please log out and log back in to refresh your session."
      });
    }

    if (!isValidObjectId(course_id)) {
      return res.status(400).json({
        error: "Invalid course_id format. This course was created with the old database system. Please ask an admin to recreate the course."
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user_id,
      course_id,
    });

    if (existingEnrollment) {
      return res
        .status(409)
        .json({ error: "User is already enrolled in this course." });
    }

    const newEnrollment = new Enrollment({
      user_id,
      course_id,
    });

    await newEnrollment.save();
    res.status(201).json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Error in enrollInCourse:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get enrolled courses for a user
const getEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const enrollments = await Enrollment.find({ user_id: userId }).populate(
      "course_id"
    );

    const enrolledCourses = enrollments.map((enrollment) => {
      const courseObj = enrollment.course_id.toObject();
      courseObj.id = courseObj._id;
      return courseObj;
    });

    res.status(200).json({ enrolledCourses });
  } catch (err) {
    console.error("Error in getEnrolledCourses:", err);
    res.status(500).json({ error: err.message });
  }
};

// Check if user is enrolled in a specific course
const isUserEnrolled = async (req, res) => {
  try {
    const { userId } = req.params;
    const courseId = req.query.courseId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required." });
    }

    // Validate ObjectIds - must be 24 character hex strings
    const isValidObjectId = (id) => {
      if (typeof id !== 'string') return false;
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    if (!isValidObjectId(userId) || !isValidObjectId(courseId)) {
      return res.json({ isEnrolled: false });
    }

    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId,
    });

    const isEnrolled = !!enrollment;
    res.json({ isEnrolled });
  } catch (err) {
    console.error("Error in isUserEnrolled:", err);
    res.status(500).json({ error: "Failed to check enrollment status." });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res
        .status(400)
        .json({ error: "user_id and course_id are required" });
    }

    // Validate ObjectIds - must be 24 character hex strings
    const isValidObjectId = (id) => {
      if (typeof id !== 'string') return false;
      return /^[0-9a-fA-F]{24}$/.test(id);
    };

    if (!isValidObjectId(user_id)) {
      return res.status(400).json({ error: "Invalid user_id format." });
    }

    if (!isValidObjectId(course_id)) {
      return res.status(400).json({ error: "Invalid course_id format." });
    }

    const result = await Enrollment.findOneAndDelete({
      user_id,
      course_id,
    });

    if (!result) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.json({ message: "Successfully unenrolled from course" });
  } catch (err) {
    console.error("Error in cancelSubscription:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Extract user ID from token utility function
const extractUserIdFromToken = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert to plain object with 'id' field
    const userObj = user.toObject();
    userObj.id = userObj._id;

    res.json(userObj);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userIdFromParams = req.params.id;
    const requestingUserId = extractUserIdFromToken(req);

    if (!requestingUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (requestingUserId !== userIdFromParams) {
      return res.status(403).json({
        error: "Access denied. You can only update your own profile.",
      });
    }

    const {
      name,
      email,
      phone,
      profile_pic,
      bio,
      subject,
      qualification,
      experience_years,
      linkedin,
      availability,
      location,
    } = req.body;

    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (profile_pic !== undefined) updateFields.profile_pic = profile_pic;
    if (bio !== undefined) updateFields.bio = bio;
    if (subject !== undefined) updateFields.subject = subject;
    if (qualification !== undefined) updateFields.qualification = qualification;
    if (experience_years !== undefined) {
      const expValue =
        experience_years === "" || experience_years === null
          ? null
          : parseInt(experience_years, 10);
      updateFields.experience_years = expValue;
    }
    if (linkedin !== undefined) updateFields.linkedin = linkedin;
    if (availability !== undefined) updateFields.availability = availability;
    if (location !== undefined) updateFields.location = location;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userIdFromParams,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all users for admin
const getAllUsersForAdmin = async (req, res) => {
  try {
    const requestingUserId = extractUserIdFromToken(req);

    if (!requestingUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const requestingUser = await User.findById(requestingUserId);

    if (!requestingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const users = await User.find()
      .select("-password")
      .sort({ created_at: -1 });

    // Convert to plain objects with 'id' field
    const usersWithId = users.map(user => {
      const userObj = user.toObject();
      userObj.id = userObj._id;
      return userObj;
    });

    res.json({ users: usersWithId });
  } catch (err) {
    console.error("Error in getAllUsersForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// Delete courses by teacher (admin only)
const deleteCoursesByTeacher = async (req, res) => {
  try {
    const adminUserId = extractUserIdFromToken(req);
    if (!adminUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const targetTeacherId = req.params.teacherId;

    if (!targetTeacherId) {
      return res.status(400).json({ error: "Teacher ID is required." });
    }

    const adminUser = await User.findById(adminUserId);

    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found." });
    }

    if (adminUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Delete enrollments for teacher's courses
    const teacherCourses = await Course.find({ teacher_id: targetTeacherId });
    const courseIds = teacherCourses.map((course) => course._id);
    await Enrollment.deleteMany({ course_id: { $in: courseIds } });

    // Delete the courses
    const result = await Course.deleteMany({ teacher_id: targetTeacherId });

    res.json({
      message: `Successfully deleted ${result.deletedCount} course(s) for teacher ID ${targetTeacherId}.`,
    });
  } catch (err) {
    console.error("Error in deleteCoursesByTeacher:", err);
    res.status(500).json({ error: "Failed to delete courses." });
  }
};

// Get courses by teacher for admin
const getCoursesByTeacherForAdmin = async (req, res) => {
  try {
    const requestingUserId = extractUserIdFromToken(req);
    if (!requestingUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const targetTeacherId = req.params.teacherId;

    if (!targetTeacherId) {
      return res.status(400).json({ error: "Teacher ID is required." });
    }

    const requestingUser = await User.findById(requestingUserId);

    if (!requestingUser) {
      return res.status(404).json({ error: "Requesting user not found." });
    }

    if (
      requestingUser.role !== "admin" &&
      requestingUserId !== targetTeacherId
    ) {
      return res.status(403).json({
        error: "Access denied. Admins or the teacher themselves only.",
      });
    }

    const courses = await Course.find({ teacher_id: targetTeacherId }).sort({
      created_at: -1,
    });

    // Convert to plain objects with 'id' field
    const coursesWithId = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.id = courseObj._id;
      return courseObj;
    });

    res.json({ courses: coursesWithId });
  } catch (err) {
    console.error("Error in getCoursesByTeacherForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
};

// Get all enrollments for admin
const getAllEnrollmentsForAdmin = async (req, res) => {
  try {
    const requestingUserId = extractUserIdFromToken(req);

    if (!requestingUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const requestingUser = await User.findById(requestingUserId);

    if (!requestingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const enrollments = await Enrollment.find()
      .populate("user_id", "name email role")
      .populate("course_id", "title subject")
      .sort({ enrollment_date: -1 });

    // Format the response
    const formattedEnrollments = enrollments.map((enrollment) => {
      return {
        id: enrollment._id,
        user_id: enrollment.user_id._id,
        course_id: enrollment.course_id._id,
        enrollment_date: enrollment.enrollment_date,
        progress: enrollment.progress,
        user_name: enrollment.user_id.name,
        user_email: enrollment.user_id.email,
        user_role: enrollment.user_id.role,
        course_title: enrollment.course_id.title,
        course_subject: enrollment.course_id.subject,
      };
    });

    res.json({ enrollments: formattedEnrollments });
  } catch (err) {
    console.error("Error in getAllEnrollmentsForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch enrollments." });
  }
};

// Get course enrollments for admin
const getCourseEnrollmentsForAdmin = async (req, res) => {
  try {
    const requestingUserId = extractUserIdFromToken(req);
    const courseId = req.params.courseId;

    if (!requestingUserId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required." });
    }

    const requestingUser = await User.findById(requestingUserId);

    if (!requestingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const enrollments = await Enrollment.find({ course_id: courseId })
      .populate("user_id", "name email role")
      .sort({ enrollment_date: -1 });

    // Format the response
    const formattedEnrollments = enrollments.map((enrollment) => {
      return {
        id: enrollment._id,
        user_id: enrollment.user_id._id,
        course_id: enrollment.course_id,
        enrollment_date: enrollment.enrollment_date,
        progress: enrollment.progress,
        user_name: enrollment.user_id.name,
        user_email: enrollment.user_id.email,
        user_role: enrollment.user_id.role,
      };
    });

    res.json({ enrollments: formattedEnrollments });
  } catch (err) {
    console.error("Error in getCourseEnrollmentsForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch enrollments." });
  }
};

module.exports = {
  signupUser,
  loginUser,
  createCourse,
  getAllCourses,
  getCoursesByTeacher,
  updateCourse,
  deleteCourse,
  specificCourse,
  enrollInCourse,
  getEnrolledCourses,
  cancelSubscription,
  deleteUser,
  updateProfile,
  changePassword,
  isUserEnrolled,
  getUserProfile,
  getAllUsersForAdmin,
  deleteCoursesByTeacher,
  getCoursesByTeacherForAdmin,
  getAllEnrollmentsForAdmin,
  getCourseEnrollmentsForAdmin,
};
