import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../src/utils/api";
import CourseCard from "../component/CourseCard";
import { getApiUrl } from "../src/config/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    apiFetch(getApiUrl("users/get-all-courses"))
      .then((response) => {
        const courseData = response.data || response;
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch((err) => {
        console.error("API Error (Courses):", err);
        setError(err.message || "Failed to fetch courses");
      })
      .finally(() => setLoading(false));
  }, []);

  // Get user role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("localStorage user:", user);
    setUserRole(user.role?.toLowerCase() || null);
  }, []);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;

    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // Helper function to determine if user is a teacher
  const isTeacher = () => {
    return userRole === "teacher";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-zinc-400">Loading courses...</p>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-zinc-400 mt-2">
            Browse our extensive library of professional courses
          </p>
        </div>

        {/* Show Add Course button only for teachers */}
        {isTeacher() && (
          <Link
            to="/add-course"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-300 whitespace-nowrap"
          >
            Add Course
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, subject, or description..."
            className="block w-full pl-10 pr-3 py-3.5 border border-zinc-700 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-zinc-400">
          Showing <span className="text-white font-medium">{filteredCourses.length}</span> of{" "}
          <span className="text-white font-medium">{courses.length}</span> courses
        </p>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-16 w-16 text-zinc-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium">No courses found</h3>
          <p className="mt-2 text-zinc-500">
            {searchQuery ? "Try adjusting your search query" : "No courses available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                instructor: course.teacher_name || "Unknown Instructor",
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
  );
};

export default Courses;