import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from "../src/contexts/AuthContext";
import CourseCard from "../component/CourseCard";
import { getApiUrl } from "../src/config/api";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorDelete, setErrorDelete] = useState(""); // New state for delete errors
  const navigate = useNavigate(); // For redirection after deletion

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const userResponse = await fetch(getApiUrl(`users/profile/${userId}`));
        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        const userData = await userResponse.json();

        let enrolledData = [];
        let teacherData = [];
        const isStudent = userData?.role !== 'teacher';
        if (isStudent) {
          const enrolledResponse = await fetch(getApiUrl(`users/enrolled-courses/${userId}`));
          if (!enrolledResponse.ok) {
            throw new Error(`HTTP error! status: ${enrolledResponse.status}`);
          }
          enrolledData = await enrolledResponse.json();
          enrolledData = Array.isArray(enrolledData.enrolledCourses) ? enrolledData.enrolledCourses : enrolledData;
        } else {
          const teacherResponse = await fetch(getApiUrl(`users/course-by-teacher/${userId}`));
          if (!teacherResponse.ok) {
            throw new Error(`HTTP error! status: ${teacherResponse.status}`);
          }
          teacherData = await teacherResponse.json();
          teacherData = Array.isArray(teacherData) ? teacherData : [];
        }

        setProfile(userData);
        setEnrolledCourses(Array.isArray(enrolledData) ? enrolledData : []);
        setTeacherCourses(Array.isArray(teacherData) ? teacherData : []);
      } catch (err) {
        console.error("API Error in Profile:", err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setErrorDelete(""); // Clear previous errors
    try {
      const response = await fetch(getApiUrl(`users/delete-user/${userId}`), {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setErrorDelete(err.message);
    }
  };

  if (!userId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-300">Please sign in to view your profile.</p>
        <Link to="/login" className="text-indigo-400 hover:underline">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const displayRole = profile?.role === 'teacher' ? 'Instructor' : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="mt-6 space-y-4">
              <Link
                to="/update-profile"
                className="w-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Delete Account
              </button>
              {errorDelete && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center text-sm">
                  {errorDelete}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-sm font-medium text-zinc-400">{profile?.role === 'teacher' ? 'Courses Created' : 'Courses Enrolled'}</p>
              <p className="mt-1 text-2xl font-bold">
                {profile?.role === 'teacher' ? teacherCourses.length : enrolledCourses.length}
              </p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {profile?.role === 'teacher' ? "Your Courses" : "Enrolled Courses"}
              </h2>
            </div>
            {profile?.role === 'teacher' ? (
              teacherCourses.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="mt-4 text-lg font-medium">You haven't created any courses</h3>
                  <p className="mt-1 text-zinc-500">
                    Create a new course in your <Link to="/dashboard" className="text-indigo-400 hover:underline">Dashboard</Link>.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teacherCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={{
                        ...course,
                        instructor: profile?.name || "Unknown Instructor",
                        rating: course.rating || 4.5,
                        students: course.enrollment_count || 0,
                        category: course.subject || course.category || "General",
                        price: course.price || 0
                      }}
                    />
                  ))}
                </div>
              )
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
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
                      instructor: course.teacher_name || "Unknown Instructor",
                      rating: course.rating || 4.5,
                      students: course.enrollment_count || 1200,
                      category: course.subject || "General",
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
