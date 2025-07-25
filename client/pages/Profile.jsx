// pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from "../src/contexts/AuthContext";
import { apiFetch } from "../src/utils/api";
import CourseCard from "../component/CourseCard";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  // State for enrolled courses - only relevant for students
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return; // Wait for user ID

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Get user profile data
        // Since there's no dedicated GET user by ID endpoint,
        // we can use the token payload (which you already have in context)
        // or potentially fetch all user data if needed.
        // For now, we'll use the data from the auth context.
        // If you need to fetch fresh user data, you'd need a backend endpoint like GET /user/:id
        // For this example, we'll enrich the context user data with what we have.
        
        // 2. Get enrolled courses for students
        let enrolledData = [];
        // Check user role from context if available, or assume student if no specific teacher fields
        const isStudent = user?.role !== 'teacher'; // Simplified check

        if (isStudent) {
          const response = await apiFetch(`http://localhost:5000/api/users/enrolled-courses/${userId}`);
          // Based on your backend, response.data should have { enrolledCourses: [...] }
          enrolledData = response.data?.enrolledCourses || response.data || [];
        }

        // Set states
        // Use user data from context as the base profile
        setProfile(user); 
        setEnrolledCourses(Array.isArray(enrolledData) ? enrolledData : []);
        
      } catch (err) {
        console.error("API Error in Profile:", err);
        if (err.response) {
            setError(`Server Error: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
            setError("Network Error: Unable to reach the server.");
        } else {
            setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, user]); // Depend on userId and user from context

  if (!userId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-zinc-800 p-6 rounded-xl inline-block">
            <User className="h-12 w-12 text-indigo-500 mx-auto" />
            <h3 className="mt-4 text-xl font-medium">Please sign in to view your profile</h3>
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
          <p className="mt-4 text-zinc-400">Loading profile...</p>
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

  // Determine role for display
  const displayRole = profile?.role === 'teacher' ? 'Instructor' : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-xl p-6 sticky top-24">
            <div className="flex flex-col items-center">
              {/* Avatar/Profile Pic */}
              <div className="bg-zinc-700 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center mb-4">
                {profile?.profile_pic ? (
                  <img 
                    src={profile.profile_pic} 
                    alt={profile?.name || "Profile"} 
                    className="rounded-xl w-24 h-24 object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-zinc-500" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-center">{profile?.name || "User"}</h2>
              <p className="text-zinc-400 text-sm mt-1">{displayRole}</p>
              
              {profile?.bio && (
                <p className="mt-4 text-zinc-300 text-center text-sm">
                  {profile.bio}
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-700 space-y-4">
              <div className="flex items-center text-sm text-zinc-300">
                <Mail className="h-4 w-4 mr-3 text-zinc-500 flex-shrink-0" />
                <span className="truncate">{profile?.email || "N/A"}</span>
              </div>
              
              {profile?.phone && (
                <div className="flex items-center text-sm text-zinc-300">
                  <Phone className="h-4 w-4 mr-3 text-zinc-500 flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              
              {profile?.location && (
                <div className="flex items-center text-sm text-zinc-300">
                  <MapPin className="h-4 w-4 mr-3 text-zinc-500 flex-shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-zinc-300">
                <Calendar className="h-4 w-4 mr-3 text-zinc-500 flex-shrink-0" />
                <span>Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/update-profile" // You'll need to create this page/route
                className="w-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Stats Section - Mock data for now */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-sm font-medium text-zinc-400">Courses Enrolled</p>
              <p className="mt-1 text-2xl font-bold">
                {profile?.role === 'teacher' ? 'N/A' : enrolledCourses.length}
              </p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-sm font-medium text-zinc-400">Certificates</p>
              <p className="mt-1 text-2xl font-bold">2</p> {/* Mock */}
            </div>
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-sm font-medium text-zinc-400">Learning Hours</p>
              <p className="mt-1 text-2xl font-bold">42</p> {/* Mock */}
            </div>
          </div>

          {/* Courses Section */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {profile?.role === 'teacher' ? "Your Courses" : "Enrolled Courses"}
              </h2>
              {profile?.role === 'teacher' && (
                <Link 
                  to="/add-course" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
                >
                  Create New Course
                </Link>
              )}
            </div>

            {profile?.role === 'teacher' ? (
              // For teachers, you'd fetch their courses
              // This would require calling getCoursesByTeacher
              // For now, we show a message
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
                <h3 className="mt-4 text-lg font-medium">Instructor View</h3>
                <p className="mt-1 text-zinc-500">
                  Visit your <Link to="/dashboard" className="text-indigo-400 hover:underline">Dashboard</Link> to manage your courses.
                </p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
                <h3 className="mt-4 text-lg font-medium">You're not enrolled in any courses</h3>
                <p className="mt-1 text-zinc-500">
                  Browse our course library to get started
                </p>
                <div className="mt-6">
                  <Link 
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={{
                      ...course,
                      // Map fields from your backend to CourseCard props
                      instructor: course.teacher_name || "Unknown Instructor", // Needs backend JOIN
                      rating: course.rating || 4.5, // Mock
                      students: course.enrollment_count || 1200, // Mock
                      category: course.subject,
                      price: course.price || 0
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;