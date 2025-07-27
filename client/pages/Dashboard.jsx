import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "../src/contexts/AuthContext";
import { apiFetch } from "../src/utils/api";
import CourseCard from "../component/CourseCard";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  const role = user?.role?.toLowerCase();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    learningHours: 0,
    certificates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !userId || !role) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        let coursesData = [];
        if (role === "teacher") {
          const response = await apiFetch(`http://localhost:5000/api/users/course-by-teacher/${userId}`);
          coursesData = Array.isArray(response) ? response : [];
        } else if (role === "student") {
          const response = await apiFetch(`http://localhost:5000/api/users/enrolled-courses/${userId}`);
          coursesData = Array.isArray(response.enrolledCourses) ? response.enrolledCourses : [];
        }

        setCourses(coursesData);

        // Fetch additional stats
        setStats({
          totalCourses: coursesData.length,
          totalStudents: role === "teacher" ? await fetchTotalStudents(userId) : 0,
          learningHours: role === "student" ? await fetchLearningHours(userId) : 0,
          certificates: role === "student" ? await fetchCertificates(userId) : 0,
        });
      } catch (err) {
        console.error("API Error in Dashboard:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, role, isAuthenticated]);

  // Mock functions for stats (async declarations added)
  const fetchTotalStudents = async (teacherId) => {
    try {
      // Placeholder: Replace with actual endpoint
      return 120; // Mock data
    } catch (err) {
      console.error("Error fetching total students:", err);
      return 0;
    }
  };

  const fetchLearningHours = async (userId) => {
    try {
      // Placeholder: Replace with actual endpoint
      return 42; // Mock data
    } catch (err) {
      console.error("Error fetching learning hours:", err);
      return 0;
    }
  };

  const fetchCertificates = async (userId) => {
    try {
      // Placeholder: Replace with actual endpoint
      return 2; // Mock data
    } catch (err) {
      console.error("Error fetching certificates:", err);
      return 0;
    }
  };

  // Handle course deletion for teachers
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      await apiFetch(`http://localhost:5000/api/users/course-delete/${courseId}`, {
        method: "DELETE",
      });

      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      setStats((prev) => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
      setActionSuccess("Course deleted successfully");

      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting course:", err);
      setActionError(err.message || "Failed to delete course");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle course subscription cancellation for students
  const handleCancelSubscription = async (courseId) => {
    if (!window.confirm("Are you sure you want to cancel your subscription to this course?")) {
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      await apiFetch(`http://localhost:5000/api/users/cancel-subscription/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, course_id: courseId }),
      });

      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      setStats((prev) => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
      setActionSuccess("Subscription cancelled successfully");

      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setActionError(err.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-zinc-800 p-6 rounded-xl inline-block">
            <BookOpen className="h-12 w-12 text-indigo-500 mx-auto" />
            <h3 className="mt-4 text-xl font-medium">Please sign in to view your dashboard</h3>
            <Link
              to="/signin"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{role === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}</h1>
        <p className="mt-2 text-zinc-400">Welcome back, {user?.name || "User"}!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                {role === "teacher" ? "Courses Created" : "Enrolled Courses"}
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.totalCourses}</p>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        </div>

        {role === "teacher" ? (
          <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Students</p>
                <p className="mt-1 text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-400">Completed Courses</p>
                <p className="mt-1 text-3xl font-bold">{stats.certificates}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">Learning Hours</p>
              <p className="mt-1 text-3xl font-bold">{stats.learningHours}</p>
              <p className="mt-1 text-xs text-green-500">+8 this month</p>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">Certificates Earned</p>
              <p className="mt-1 text-3xl font-bold">{stats.certificates}</p>
              <p className="mt-1 text-xs text-green-500">+1 this month</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-zinc-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {role === "teacher" ? "Your Courses" : "Enrolled Courses"}
          </h2>
          {role === "teacher" && (
            <Link
              to="/add-course"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
            >
              Create New Course
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">
              {role === "teacher" ? "You haven't created any courses yet" : "You're not enrolled in any courses"}
            </h3>
            <p className="mt-1 text-zinc-500">
              {role === "teacher" ? "Start by creating your first course" : "Browse our course library to get started"}
            </p>
            <div className="mt-6">
              <Link
                to={role === "teacher" ? "/add-course" : "/courses"}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {role === "teacher" ? "Create Course" : "Browse Courses"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {actionError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
                {actionSuccess}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700">
                  <CourseCard
                    course={{
                      ...course,
                      instructor: role === "teacher" ? "You" : course.instructor_name || "Unknown Instructor",
                      rating: course.rating || 4.5,
                      students: course.enrollment_count || 1200,
                      category: course.subject,
                      price: course.price || 0,
                    }}
                  />
                  <div className="px-4 py-3 border-t border-zinc-800 flex justify-end space-x-2">
                    {role === "teacher" ? (
                      <>
                        <Link
                          to={`/edit-course/${course.id}`}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          {actionLoading ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleCancelSubscription(course.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? "Cancelling..." : "Cancel Subscription"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Teacher-Specific Section: Recent Student Activity */}
      {role === "teacher" && (
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Student Activity</h2>
            <Link
              to="/teacher/activity"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, name: "Sarah Johnson", course: "Advanced React", time: "2 hours ago" },
              { id: 2, name: "Michael Chen", course: "JavaScript Basics", time: "1 day ago" },
              { id: 3, name: "Emily Davis", course: "Web Development", time: "2 days ago" },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-zinc-900 rounded-lg">
                <div className="bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">
                    {activity.name} enrolled in "{activity.course}"
                  </h3>
                  <p className="text-sm text-zinc-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student-Specific Section: Recommended Courses */}
      {role === "student" && (
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recommended Courses</h2>
            <Link
              to="/courses"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: "Python for Beginners", instructor: "John Doe", rating: 4.7, students: 1500, category: "Programming", price: 29.99 },
              { id: 2, title: "Data Science Essentials", instructor: "Jane Smith", rating: 4.8, students: 2000, category: "Data Science", price: 39.99 },
              { id: 3, title: "UI/UX Design", instructor: "Alex Brown", rating: 4.6, students: 1000, category: "Design", price: 24.99 },
            ].map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  instructor: course.instructor,
                  rating: course.rating,
                  students: course.students,
                  category: course.category,
                  price: course.price,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;