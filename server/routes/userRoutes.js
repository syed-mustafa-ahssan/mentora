const express = require('express');
const router = express.Router();
const { signupUser, loginUser, createCourse, getAllCourses, getCoursesByTeacher, updateCourse, deleteCourse, specificCourse, enrollInCourse, getEnrolledCourses, cancelSubscription, deleteUser, updateProfile, changePassword, isUserEnrolled, getUserProfile, getAllUsersForAdmin, deleteCoursesByTeacher, getCoursesByTeacherForAdmin } = require('../controllers/Controller');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/course-upload', createCourse);
router.get('/get-all-courses', getAllCourses);
router.get('/course-by-teacher/:teacherId', getCoursesByTeacher);
router.put('/course-update/:id', updateCourse);
router.delete('/course-delete/:id', deleteCourse);
router.delete('/cancel-subscription/:id', cancelSubscription);
router.get('/course-detail/:id', specificCourse);
router.post('/enroll', enrollInCourse);
router.get('/enrolled-courses/:userId', getEnrolledCourses);
router.get('/is-enrolled/:userId', isUserEnrolled);
router.get('/profile/:userId', getUserProfile);
router.delete('/delete-user/:id', deleteUser);
router.put('/update-profile/:id', updateProfile);
router.put('/change-password', changePassword);
router.get('/admin/all-users', getAllUsersForAdmin);
router.delete('/admin/delete-courses-by-teacher/:teacherId', deleteCoursesByTeacher);
router.get('/admin/courses-by-teacher/:teacherId', getCoursesByTeacherForAdmin);

module.exports = router;
