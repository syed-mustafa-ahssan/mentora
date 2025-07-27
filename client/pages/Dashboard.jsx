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

        // Fetch additional stats (mocked for now, replace with backend endpoints if available)
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

  // Mock functions for stats (replace with actual backend endpoints)
  const fetchTotalStudents = async (teacherId) => {
    // Placeholder: Replace with actual endpoint like /api/users/teacher-stats/:teacherId
    return 120; // Mock data
  };

  const fetchLearningHours = async (userId) => {
    // Placeholder: Replace with actual endpoint like /api/users/student-stats/:userId
    return 42; // Mock data
  };

  const fetchCertificates = async (userId) => {
    // Placeholder: Replace with actual endpoint like /api/users/certificates/:userId
    return 2; // Mock data
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
        <p className="mt-2 text-zinc-400">
          Welcome back, {user?.name || "User"}!
        </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  instructor: role === "teacher" ? "You" : course.instructor_name || "Unknown Instructor",
                  rating: course.rating || 4.5,
                  students: course.enrollment_count || 1200,
                  category: course.subject,
                  price: course.price || 0,
                }}
              />
            ))}
          </div>
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
            {/* Mock data: Replace with actual backend endpoint like /api/users/teacher/:teacherId/activity */}
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
            {/* Mock data: Replace with actual backend endpoint like /api/users/recommended-courses/:userId */}
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