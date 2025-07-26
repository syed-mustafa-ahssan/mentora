import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Play,
  Download,
  CheckCircle,
  Award,
  User,
  FileText,
  Video,
} from "lucide-react";

import { apiFetch, apiPost } from "../src/utils/api";
import { useAuth } from "../src/contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Memoize material type detection
  const materialType = useMemo(() => {
    if (!course?.material_url) return null;
    const url = course.material_url.toLowerCase();
    if (url.endsWith(".pdf")) return "pdf";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) return "video";
    return "iframe"; // Fallback for other embeddable content
  }, [course?.material_url]);

  useEffect(() => {
    if (!id) return;
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // Assumes token is stored in localStorage
        const response = await apiFetch(
          `http://localhost:5000/api/users/course-detail/${id}`,
          {},
          token
        );
        // Assuming backend returns course data with instructor_name, rating, enrollment_count
        setCourse({
          ...response,
          // Default values in case backend doesn't provide them
          instructor_name: response.instructor_name || "Unknown Instructor",
          rating: response.rating || 4.5,
          enrollment_count: response.enrollment_count || 0,
          // Mock modules and learning outcomes until added to backend
          learningOutcomes: response.learningOutcomes || [
            "Understand core concepts",
            "Apply skills in projects",
            "Master best practices",
          ],
          modules: response.modules || [
            { id: 1, title: "Introduction", lessons: 5, duration: "1h 30m" },
            { id: 2, title: "Core Concepts", lessons: 8, duration: "2h 15m" },
            { id: 3, title: "Advanced Topics", lessons: 6, duration: "1h 45m" },
          ],
          instructorInfo: {
            name: response.instructor_name || "Unknown Instructor",
            bio: response.instructor_bio || "Experienced instructor in the field.",
            rating: response.instructor_rating || 4.5,
            students: response.instructor_students || 1000,
            courses: response.instructor_courses || 5,
            avatar: response.instructor_avatar || "https://placehold.co/100x100/18181b/ffffff?text=Instructor",
          },
        });
      } catch (err) {
        console.error("API Error:", err);
        setError(
          err.response?.status === 404
            ? "Course not found."
            : "Failed to load course details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (!user?.id) {
      setError("User information is missing. Please sign in again.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await apiPost(
        "http://localhost:5000/api/users/enroll",
        { user_id: user.id, course_id: parseInt(id, 10) },
        token
      );
      alert("Successfully enrolled in the course!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Enrollment Error:", err);
      if (err.message.includes("already enrolled")) {
        alert("You are already enrolled in this course.");
        navigate("/dashboard");
      } else {
        setError("Failed to enroll in the course. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-zinc-400">Loading course details...</p>
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

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium">Course not found</h3>
          <p className="mt-1 text-zinc-500">The course you are looking for does not exist.</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 mt-6"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const priceDisplay = course.access_type === "free" ? (
    <span className="text-2xl font-bold text-green-500">Free</span>
  ) : (
    <p className="text-2xl font-bold">
      $
      {typeof course.price === "number"
        ? course.price.toFixed(2)
        : parseFloat(course.price) && !isNaN(parseFloat(course.price))
          ? parseFloat(course.price).toFixed(2)
          : "0.00"}
    </p>
  );
  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "curriculum", name: "Curriculum" },
    { id: "instructor", name: "Instructor" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm text-zinc-400">
        <Link to="/courses" className="hover:text-indigo-400">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-200 truncate max-w-md">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/1200x800/18181b/ffffff?text=Course+Image";
                }}
              />
            ) : (
              <div className="bg-zinc-700 border-2 border-dashed w-full h-64 md:h-80 flex items-center justify-center">
                <span className="text-zinc-500">No Image Available</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-1/3">
            <div className="flex items-center bg-indigo-500/20 text-indigo-400 text-xs font-semibold px-2 py-1 rounded mb-3">
              {course.subject || "General"}
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-zinc-300 mb-4">
              By <span className="font-medium">{course.instructor_name}</span>
            </p>
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-amber-500/20 text-amber-400 text-sm px-2 py-1 rounded">
                <Star size={14} className="fill-current" />
                <span className="ml-1 font-medium">{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-sm text-zinc-400 ml-3">
                <Users size={16} className="mr-1" />
                <span>{(course.enrollment_count / 1000).toFixed(1)}k students</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-zinc-400 mb-6">
              <Clock size={16} className="mr-1" />
              <span>
                {course.duration || "N/A"} • {course.level || "Beginner"}
              </span>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center justify-between mb-4">
                {priceDisplay}
                <button
                  onClick={handleEnroll}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition duration-300"
                >
                  Enroll Now
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                <p className="text-center text-zinc-300 mb-3">Sign in to enroll in this course</p>
                <Link
                  to="/signin"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-center block"
                >
                  Sign In to Enroll
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-300"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-zinc-300 mb-8">{course.description || "No description available."}</p>

              {course?.material_url && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    {materialType === "pdf" && <FileText className="mr-2" />}
                    {(materialType === "video" || materialType === "youtube") && (
                      <Video className="mr-2" />
                    )}
                    Preview Material
                  </h2>
                  <div className="bg-zinc-800 rounded-xl p-4 min-h-[400px]">
                    {materialType === "pdf" ? (
                      <embed
                        src={`${course.material_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                        title={`Preview of ${course.title}`}
                        className="rounded-lg border border-zinc-700"
                      />
                    ) : materialType === "youtube" ? (
                      (() => {
                        const videoIdMatch = course.material_url.match(
                          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                        );
                        const videoId = videoIdMatch ? videoIdMatch[1] : null;
                        return videoId ? (
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={`YouTube video player for ${course.title}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full rounded-lg"
                            ></iframe>
                          </div>
                        ) : (
                          <p className="text-zinc-400">Could not load YouTube preview.</p>
                        );
                      })()
                    ) : materialType === "video" ? (
                      <div className="aspect-w-16 aspect-h-9">
                        <video
                          src={course.material_url}
                          controls
                          className="w-full h-full rounded-lg"
                          title={`Video preview for ${course.title}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <p className="text-zinc-300">
                        Preview not available.{" "}
                        <a
                          href={course.material_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline"
                        >
                          View material
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <h2 className="text-xl font-bold mb-4 mt-8">What you'll learn</h2>
              <ul className="space-y-3 mb-8">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-zinc-300">{outcome}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">Basic knowledge of related concepts</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">Computer with internet access</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="bg-zinc-800 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Course Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Play className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">{course.modules?.length || 0} modules</span>
                  </li>
                  <li className="flex items-center">
                    <Download className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">Downloadable resources</span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">Certificate of completion</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">Full lifetime access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === "curriculum" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Course Curriculum</h2>
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="bg-zinc-800 rounded-xl p-5">
                    <h3 className="font-bold text-lg">Module {module.id}: {module.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      {module.lessons} lessons • {module.duration}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
                <h3 className="mt-4 text-lg font-medium">Curriculum not available</h3>
                <p className="mt-1 text-zinc-500">The curriculum is coming soon.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "instructor" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-zinc-800 rounded-xl p-6 text-center">
                <img
                  src={course.instructorInfo.avatar}
                  alt={course.instructorInfo.name}
                  className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100/18181b/ffffff?text=Instructor";
                  }}
                />
                <h3 className="font-bold text-lg">{course.instructorInfo.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">Course Instructor</p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.rating.toFixed(1)}</p>
                    <p className="text-xs text-zinc-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{(course.instructorInfo.students / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-zinc-400">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.courses}</p>
                    <p className="text-xs text-zinc-400">Courses</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">About the Instructor</h2>
              <p className="text-zinc-300">{course.instructorInfo.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;