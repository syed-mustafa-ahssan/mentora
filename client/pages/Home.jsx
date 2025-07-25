// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../src/utils/api";
import { useAuth } from "../src/contexts/AuthContext";
import CourseCard from "../component/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    apiFetch("http://localhost:5000/api/users/get-all-courses")
      .then(response => {
        // Ensure we're getting the data correctly
        const courseData = response.data || response;
        setCourses(Array.isArray(courseData) ? courseData : []);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message || "Failed to fetch courses");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-zinc-400">Loading courses...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-center">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">Advance Your Career</span>
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mt-2">
                With Expert-Led Courses
              </span>
            </h1>
            <p className="mt-6 text-xl text-zinc-300 max-w-2xl">
              Join over 500,000 students learning with Mentora. Gain in-demand skills from industry experts and advance your career.
            </p>
            <div className="mt-10">
              <Link
                to="/courses"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <p className="mt-2 text-zinc-400">
              Hand-picked courses for your career growth
            </p>
          </div>
          <div>
            <Link
              to="/courses"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
            >
              View All
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No courses available</h3>
            <p className="mt-1 text-zinc-500">Check back later for new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  // Map your backend fields to CourseCard props
                  instructor: course.teacher_name || "Unknown Instructor",
                  rating: 4.5, // Mock rating - implement in backend
                  students: 1200, // Mock student count - implement in backend
                  category: course.subject,
                  price: course.price || 0
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-10">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Web Development", "Data Science", "Design", "Marketing"].map((category, index) => (
            <div
              key={index}
              className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-indigo-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <div className="bg-indigo-500 w-6 h-6 rounded"></div>
              </div>
              <h3 className="font-bold text-lg">{category}</h3>
              <p className="text-zinc-400 text-sm mt-2">12 courses</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-zinc-300 mb-8">
            Join thousands of students advancing their careers with our expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="px-6 py-3 bg-white text-indigo-900 font-medium rounded-lg hover:bg-zinc-100 transition duration-300"
            >
              Browse Courses
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition duration-300"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;