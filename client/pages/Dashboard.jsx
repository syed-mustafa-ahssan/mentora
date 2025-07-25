// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from "../src/contexts/AuthContext";
import { apiFetch } from "../src/utils/api";
import CourseCard from "../component/CourseCard";

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const role = user?.role;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ensure user data is available before proceeding
    if (!userId || !role) {
        // If user is not authenticated, we shouldn't be on this page anyway due to ProtectedRoute,
        // but good to handle. The loading state might be misleading here if user is null.
        // Let's rely on ProtectedRoute to handle unauthenticated access.
        if (userId === undefined && role === undefined) {
             // User object exists but id/role are missing - still loading auth state
             return;
        }
        // If userId or role is explicitly null/undefined after auth loaded
        if (!userId || !role) {
             setLoading(false); // Stop loading if user data is incomplete
             return;
        }
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      
      try {
        let coursesData = [];
        if (role === "teacher") {
          // Fetch teacher's courses using the correct endpoint
          // Make sure this matches your backend route: /api/users/course-by-teacher/:teacherId
          const response = await apiFetch(`/course-by-teacher/${userId}`);
          // Handle potential response structure variations
          coursesData = response.data || response;
        } else {
          // Fetch student's enrolled courses using the correct endpoint
          // Make sure this matches your backend route: /api/users/enrolled-courses/:userId
          const response = await api.get(`/enrolled-courses/${userId}`);
          // Handle potential response structure variations
          // Backend returns { enrolledCourses: [...] }
          coursesData = response.data?.enrolledCourses || response.data || [];
        }
        
        // Ensure coursesData is always an array
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error("API Error in Dashboard:", err);
        // Provide more specific error messages
        if (err.response) {
            // Server responded with error status
            setError(`Server Error: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
            // Request was made but no response received
            setError("Network Error: Unable to reach the server.");
        } else {
            // Something else happened
            setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, role]); // Re-run if userId or role changes

  // Handle case where user is not authenticated (should be handled by ProtectedRoute)
  if (!userId && !loading) {
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>

      {/* Stats Overview - Using mock data as backend doesn't provide these yet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                {role === "teacher" ? "Courses Created" : "Enrolled Courses"}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {courses.length} {/* Use actual course count */}
              </p>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                {role === "teacher" ? "Total Students" : "Completed Courses"}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {/* Mock data - replace with real stats when backend provides them */}
                {role === "teacher" ? 120 : 3}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400">Learning Hours</p>
              <p className="mt-1 text-3xl font-bold">42</p> {/* Mock data */}
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
              <p className="text-sm font-medium text-zinc-400">Certificates</p>
              <p className="mt-1 text-3xl font-bold">2</p> {/* Mock data */}
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
              {role === "teacher" 
                ? "You haven't created any courses yet" 
                : "You're not enrolled in any courses"}
            </h3>
            <p className="mt-1 text-zinc-500">
              {role === "teacher" 
                ? "Start by creating your first course" 
                : "Browse our course library to get started"}
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
                  // Map fields from your backend to CourseCard props
                  // Adjust these mappings based on your actual database schema and CourseCard expectations
                  instructor: role === "teacher" 
                    ? "You" 
                    : (course.teacher_name || "Unknown Instructor"), // You might need to join with user table in backend
                  rating: course.rating || 4.5, // Backend doesn't seem to store rating, using mock
                  students: course.enrollment_count || 1200, // Backend doesn't seem to store this, using mock
                  category: course.subject,
                  price: course.price || 0
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Additional Section for Teachers */}
      {role === "teacher" && (
        <div className="mt-8 bg-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Student Activity</h2>
          {/* Mock activity - you'd need a backend endpoint for this */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 bg-zinc-900 rounded-lg">
                <div className="bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Sarah Johnson enrolled in "Advanced React"</h3>
                  <p className="text-sm text-zinc-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;