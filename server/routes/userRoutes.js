const express = require('express');
const router = express.Router();
const { signupUser, loginUser, createCourse, getAllCourses, getCoursesByTeacher, updateCourse, deleteCourse, specificCourse, enrollInCourse, getEnrolledCourses, cancelSubscription, deleteUser, updateProfile, changePassword } = require('../controllers/Controller');

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
router.delete('/delete-user/:id', deleteUser);
router.put('/update-profile/:id', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
