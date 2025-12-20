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
  FileText,
  Video,
  X,
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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requirements, setRequirements] = useState({
    system: "",
    timeCommitment: "",
    goals: "",
  });
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Memoize material type detection
  const materialType = useMemo(() => {
    if (!course?.material_url) return null;
    const url = course.material_url.toLowerCase();
    if (url.endsWith(".pdf")) return "pdf";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) return "video";
    return "iframe";
  }, [course?.material_url]);

  useEffect(() => {
    if (!id) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch(
          `http://localhost:5000/api/users/course-detail/${id}`,
          {},
          token
        );
        // Backend now provides comprehensive data
        setCourse({
          ...response,
          // Use real data from backend, with fallbacks
          instructor_name: response.instructor_name || "Unknown Instructor",
          rating: response.rating || 0,
          enrollment_count: response.enrollment_count || 0,
          learningOutcomes: response.learningOutcomes && response.learningOutcomes.length > 0
            ? response.learningOutcomes
            : ["Master the fundamental concepts", "Apply knowledge in real projects", "Build practical skills"],
          prerequisites: response.prerequisites || [],
          modules: response.modules && response.modules.length > 0
            ? response.modules.map((m, idx) => ({ ...m, id: idx + 1 }))
            : [],
          language: response.language || "English",
          // Instructor info is now provided by backend
          instructorInfo: response.instructorInfo || {
            name: response.instructor_name || "Unknown Instructor",
            bio: "Experienced instructor passionate about teaching.",
            rating: 0,
            totalStudents: 0,
            totalCourses: 0,
            avatar: "https://ui-avatars.com/api/?name=Instructor&background=4f46e5&color=fff&size=100",
          },
        });
      } catch (err) {
        console.error("API Error fetching course:", err);
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

  // --- Check Enrollment Status Effect ---
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      // Skip enrollment check for teachers or admins
      if (!isAuthenticated || !user?.id || !id || ["teacher", "admin"].includes(user?.role)) {
        setCheckingEnrollment(false);
        setIsEnrolled(false);
        return;
      }

      setCheckingEnrollment(true);
      setIsEnrolled(false);

      try {
        const response = await apiFetch(
          `http://localhost:5000/api/users/is-enrolled/${user.id}?courseId=${id}`
        );
        setIsEnrolled(response.isEnrolled);
      } catch (err) {
        console.error("Error checking enrollment status:", err);
        setIsEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkEnrollmentStatus();
  }, [isAuthenticated, user?.id, user?.role, id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    if (!user?.id) {
      setError("User information is missing. Please sign in again.");
      return;
    }
    setIsModalOpen(true);
  };

  // --- Handle Modal Form Changes ---
  const handleRequirementChange = (e) => {
    const { name, value } = e.target;
    setRequirements((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle Actual Enrollment after Modal ---
  const confirmEnrollment = async () => {
    if (!user?.id || !id) {
      setError("User or course information is missing.");
      return;
    }

    setIsEnrolling(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log("Enrollment Requirements Submitted:", requirements);

      // Enroll the user
      await apiPost(
        "http://localhost:5000/api/users/enroll",
        { user_id: user.id, course_id: id },
        token
      );

      // Update state to reflect enrollment
      setIsEnrolled(true); // Immediately set to enrolled
      alert("Successfully enrolled in the course!");
      setIsModalOpen(false);
      setRequirements({ system: "", timeCommitment: "", goals: "" });
    } catch (err) {
      console.error("Enrollment Error:", err);
      if (err.response?.status === 409) {
        setError("You are already enrolled in this course.");
        setIsEnrolled(true); // Set enrolled state even on conflict
        setIsModalOpen(false);
      } else {
        setError("Failed to enroll in the course. Please try again.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  // --- Close Modal Handler ---
  const closeModal = () => {
    setIsModalOpen(false);
    setRequirements({ system: "", timeCommitment: "", goals: "" });
    setError("");
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
  if (error && !loading) {
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
                <span className="ml-1 font-medium">{course.rating?.toFixed(1) || 0}</span>
                {course.total_ratings > 0 && (
                  <span className="ml-1 text-xs">({course.total_ratings})</span>
                )}
              </div>
              <div className="flex items-center text-sm text-zinc-400 ml-3">
                <Users size={16} className="mr-1" />
                <span>
                  {course.enrollment_count >= 1000
                    ? `${(course.enrollment_count / 1000).toFixed(1)}k`
                    : course.enrollment_count || 0} students
                </span>
              </div>
            </div>
            <div className="flex items-center text-sm text-zinc-400 mb-6">
              <Clock size={16} className="mr-1" />
              <span>
                {course.duration || "N/A"} • {course.level || "Beginner"}
              </span>
            </div>
            {isAuthenticated ? (
              !["teacher", "admin"].includes(user?.role) ? (
                <div className="flex items-center justify-between mb-4">
                  {priceDisplay}
                  <button
                    onClick={handleEnroll}
                    disabled={checkingEnrollment || isEnrolling || isEnrolled}
                    className={`py-2 px-6 rounded-lg font-medium transition duration-300 ${checkingEnrollment || isEnrolling
                      ? "bg-indigo-400 cursor-not-allowed"
                      : isEnrolled
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                  >
                    {checkingEnrollment
                      ? "Checking..."
                      : isEnrolling
                        ? "Enrolling..."
                        : isEnrolled
                          ? "Enrolled"
                          : "Enroll Now"}
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  {priceDisplay}
                  <p className="text-zinc-400 text-sm mt-2">
                    Enrollment is not available for {user?.role} accounts.
                  </p>
                </div>
              )
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

              {isEnrolled && course?.material_url && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    {materialType === "pdf" && <FileText className="mr-2" />}
                    {(materialType === "video" || materialType === "youtube") && (
                      <Video className="mr-2" />
                    )}
                    Preview Material
                  </h2>
                  <div className="bg-zinc-800 rounded-xl p-4 min-h-[500px] relative">
                    {materialType === "pdf" ? (
                      <embed
                        src={`${course.material_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        title={`Preview of ${course.title}`}
                        className="rounded-lg border border-zinc-700 absolute inset-0"
                      />
                    ) : materialType === "youtube" ? (
                      (() => {
                        const videoIdMatch = course.material_url.match(
                          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                        );
                        const videoId = videoIdMatch ? videoIdMatch[1] : null;
                        return videoId ? (
                          <div className="w-full h-full absolute inset-0">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={`YouTube video player for ${course.title}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              width="100%"
                              height="100%"
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        ) : (
                          <p className="text-zinc-400 absolute inset-0 flex items-center justify-center">
                            Could not load YouTube preview.
                          </p>
                        );
                      })()
                    ) : materialType === "video" ? (
                      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                        <video
                          src={course.material_url}
                          controls
                          className="w-full h-full rounded-lg max-w-full max-h-full"
                          title={`Video preview for ${course.title}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <p className="text-zinc-300 absolute inset-0 flex items-center justify-center">
                        Preview not available.{" "}
                        <a
                          href={course.material_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline ml-1"
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
              {course.prerequisites && course.prerequisites.length > 0 ? (
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                      <span className="text-zinc-300">{prereq}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                    <span className="text-zinc-300">No specific prerequisites required</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                    <span className="text-zinc-300">Computer with internet access</span>
                  </li>
                </ul>
              )}
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
                    <p className="font-bold">{course.instructorInfo.rating?.toFixed(1) || 0}</p>
                    <p className="text-xs text-zinc-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">
                      {course.instructorInfo.totalStudents >= 1000
                        ? `${(course.instructorInfo.totalStudents / 1000).toFixed(1)}k`
                        : course.instructorInfo.totalStudents || 0}
                    </p>
                    <p className="text-xs text-zinc-400">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.totalCourses || 0}</p>
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

      {/* --- Enrollment Requirements Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-70">
          <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Enrollment Requirements</h2>
            <p className="text-zinc-400 mb-4">Please provide the following information to enroll:</p>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); confirmEnrollment(); }}>
              <div className="mb-4">
                <label htmlFor="system" className="block text-sm font-medium text-zinc-300 mb-1">
                  System/Software Access
                </label>
                <input
                  type="text"
                  id="system"
                  name="system"
                  value={requirements.system}
                  onChange={handleRequirementChange}
                  placeholder="e.g., Python 3.8+, VS Code"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeCommitment" className="block text-sm font-medium text-zinc-300 mb-1">
                  Weekly Time Commitment
                </label>
                <select
                  id="timeCommitment"
                  name="timeCommitment"
                  value={requirements.timeCommitment}
                  onChange={handleRequirementChange}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                >
                  <option value="">Select...</option>
                  <option value="1-2 hours">1-2 hours</option>
                  <option value="3-5 hours">3-5 hours</option>
                  <option value="5+ hours">5+ hours</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="goals" className="block text-sm font-medium text-zinc-300 mb-1">
                  Learning Goals
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  value={requirements.goals}
                  onChange={handleRequirementChange}
                  placeholder="What do you hope to achieve in this course?"
                  rows="3"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-600 rounded-lg hover:bg-zinc-700 transition"
                  disabled={isEnrolling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${isEnrolling ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  {isEnrolling ? "Enrolling..." : "Confirm Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;