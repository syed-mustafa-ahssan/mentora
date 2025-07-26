// pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from "../src/contexts/AuthContext"; // Ensure correct path
import { apiFetch } from "../src/utils/api"; // Ensure correct path
import CourseCard from "../component/CourseCard"; // Ensure correct path

const Profile = () => {
  const { user, userUpdated } = useAuth(); // --- ADD userUpdated ---
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // --- FETCH FRESH USER DATA FROM THE BACKEND ---
        // Assuming you have a GET /api/users/:id endpoint
        const userResponse = await apiFetch(`http://localhost:5000/api/users/profile/${userId}`);
        const userData = userResponse.data; // Adjust based on your API response structure

        let enrolledData = [];
        const isStudent = userData?.role !== 'teacher';

        if (isStudent) {
           const enrolledResponse = await apiFetch(`http://localhost:5000/api/users/enrolled-courses/${userId}`);
           enrolledData = enrolledResponse.data?.enrolledCourses || enrolledResponse.data || [];
        }

        // --- UPDATE STATE WITH FRESH DATA ---
        setProfile(userData);
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
        // Optionally reset profile state on error if needed
        // setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // --- DEPEND ON userUpdated TO TRIGGER REFRESH ---
    // When triggerUserUpdate() is called in the context, userUpdated changes,
    // causing this effect to run again.
  }, [userId, userUpdated]); // --- UPDATED DEPENDENCIES ---

  // ... (rest of the component logic remains largely the same,
  // but now uses the fetched `profile` state instead of the context `user` directly for display)

  if (!userId) {
    // ... (sign-in prompt)
  }

  if (loading) {
    // ... (loading spinner)
  }

  if (error) {
    // ... (error display)
  }

  // Use `profile` state for display, which holds the fetched data
  const displayRole = profile?.role === 'teacher' ? 'Instructor' : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-xl p-6 sticky top-24">
            <div className="flex flex-col items-center">
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
                to="/update-profile"
                className="w-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-sm font-medium text-zinc-400">Courses Enrolled</p>
              <p className="mt-1 text-2xl font-bold">
                {profile?.role === 'teacher' ? 'N/A' : enrolledCourses.length}
              </p>
            </div>
            {/* ... other stats ... */}
          </div>

          {/* Courses Section */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {profile?.role === 'teacher' ? "Your Courses" : "Enrolled Courses"}
              </h2>
              {/* ... teacher actions ... */}
            </div>
            {/* ... course display logic ... */}
             {profile?.role === 'teacher' ? (
              // For teachers, you'd fetch their courses
              // This would require calling getCoursesByTeacher
              // For now, we show a message or link to dashboard
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
                      instructor: course.teacher_name || "Unknown Instructor",
                      rating: course.rating || 4.5, // Mock or from backend
                      students: course.enrollment_count || 1200, // Mock or from backend
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