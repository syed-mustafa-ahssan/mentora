// pages/CourseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import useNavigate
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Play,
  Download,
  CheckCircle,
  ChevronRight,
  Award,
  User,
} from "lucide-react";
import { apiFetch } from "../src/utils/api";
import { useAuth } from "../src/contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For redirecting after enrollment
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState(1); // Not used in mock, but kept for structure

  useEffect(() => {
    if (!id) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiFetch(`http://localhost:5000/api/users/course-detail/${id}`);
        const courseData = response.data || response;
        
        // Enhance course data with mock details for now
        // In a real scenario, you'd get this from the backend or a JOIN
        const enhancedCourseData = {
          ...courseData,
          // Mock data - you'd need to join with user table or have these in courses table
          teacher_name: courseData.teacher_name || "Alex Johnson",
          rating: courseData.rating || 4.8,
          enrollment_count: courseData.enrollment_count || 12400,
          level: courseData.level || "Intermediate",
          duration: courseData.duration || "12 hours",
          description: courseData.description || "No description available for this course.",
          learningOutcomes: courseData.learningOutcomes || [
            "Master advanced concepts",
            "Build real-world projects",
            "Understand best practices"
          ],
          modules: courseData.modules || [
            { id: 1, title: "Introduction", lessons: 5, duration: "1h 30m" },
            { id: 2, title: "Core Concepts", lessons: 8, duration: "2h 15m" },
            { id: 3, title: "Advanced Topics", lessons: 6, duration: "1h 45m" },
          ],
          instructorInfo: courseData.instructorInfo || {
            name: courseData.teacher_name || "Alex Johnson",
            bio: "Experienced instructor with expertise in this field.",
            rating: 4.9,
            students: 85000,
            courses: 12,
            avatar: "https://placehold.co/100x100/18181b/ffffff?text=Instructor"
          }
        };
        
        setCourse(enhancedCourseData);
      } catch (err) {
        console.error("API Error fetching course:", err);
        if (err.response?.status === 404) {
          setError("Course not found.");
        } else {
          setError("Failed to load course details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to sign-in if not authenticated
      navigate("/signin");
      return;
    }

    if (!user?.id) {
      setError("User information is missing. Please try signing in again.");
      return;
    }

    try {
      // Call the enroll endpoint
      await api.post("/enroll", {
        user_id: user.id,
        course_id: parseInt(id, 10) // Ensure course ID is an integer
      });
      
      // On successful enrollment, redirect to a learning page or dashboard
      // For now, we'll redirect to the dashboard
      alert("Successfully enrolled in the course!");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Enrollment Error:", err);
      if (err.response?.status === 409) {
        alert("You are already enrolled in this course.");
        // Optionally redirect to dashboard or learning page
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
          <p className="mt-1 text-zinc-500">
            The course you are looking for does not exist.
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
      </div>
    );
  }

  // Determine price display
  const priceDisplay = course.access_type === 'free' ? (
    <span className="text-2xl font-bold text-green-500">Free</span>
  ) : (
    <div>
      <p className="text-2xl font-bold">${course.price?.toFixed(2)}</p>
      {/* You can add a strikethrough original price if you have it */}
      {/* <p className="text-sm text-zinc-400 line-through">$129.99</p> */}
    </div>
  );

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "curriculum", name: "Curriculum" },
    { id: "instructor", name: "Instructor" },
    // { id: "reviews", name: "Reviews" }, // Add back when reviews are implemented
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
                onError={(e) => { e.target.src = 'https://placehold.co/1200x800/18181b/ffffff?text=Course+Image'; }}
              />
            ) : (
              <div className="bg-zinc-700 border-2 border-dashed w-full h-64 md:h-80 flex items-center justify-center">
                <span className="text-zinc-500">No Image Available</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-1/3">
            <div className="flex items-center bg-indigo-500/20 text-indigo-400 text-xs font-semibold px-2 py-1 rounded mb-3">
              {course.subject}
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-zinc-300 mb-4">
              By <span className="font-medium">{course.teacher_name}</span>
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
                {course.duration} • {course.level}
              </span>
            </div>

            {/* Enrollment Section */}
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
                <p className="text-center text-zinc-300 mb-3">
                  Sign in to enroll in this course
                </p>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
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
              <p className="text-zinc-300 mb-8">{course.description}</p>
              
              <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
              <ul className="space-y-3 mb-8">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-zinc-300">{outcome}</span>
                  </li>
                ))}
              </ul>
              
              {/* Requirements - Mock data */}
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">
                    Basic knowledge of related concepts
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">
                    Computer with internet access
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="bg-zinc-800 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Course Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Play className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">
                      {course.modules?.length || 0} modules
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Download className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">
                      Downloadable resources
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Award className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">
                      Certificate of completion
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">Full lifetime access</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">
                      Access on mobile and TV
                    </span>
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
                  <div
                    key={module.id}
                    className="bg-zinc-800 rounded-xl overflow-hidden"
                  >
                    <button
                      // onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)} // Enable if you add topics
                      className="w-full flex justify-between items-center p-5 text-left"
                    >
                      <div>
                        <h3 className="font-bold text-lg">
                          Module {module.id}: {module.title}
                        </h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          {module.lessons} lessons • {module.duration}
                        </p>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-zinc-400 transform transition-transform`}
                        // ${expandedModule === module.id ? "rotate-90" : ""} // Enable if you add topics
                      />
                    </button>
                    {/* {expandedModule === module.id && (
                      <div className="px-5 pb-5 border-t border-zinc-700 pt-4">
                        <ul className="space-y-3">
                          {module.topics?.map((topic, index) => ( // You'd need to define topics in your backend
                            <li key={index} className="flex items-start">
                              <Play className="h-4 w-4 text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                              <span className="text-zinc-300">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-zinc-600 mx-auto" />
                <h3 className="mt-4 text-lg font-medium">Curriculum not available</h3>
                <p className="mt-1 text-zinc-500">
                  The detailed curriculum for this course is coming soon.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "instructor" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-zinc-800 rounded-xl p-6 text-center">
                {course.instructorInfo?.avatar ? (
                  <img
                    src={course.instructorInfo.avatar}
                    alt={course.instructorInfo.name}
                    className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100/18181b/ffffff?text=Instructor'; }}
                  />
                ) : (
                  <div className="bg-zinc-700 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-zinc-500" />
                  </div>
                )}
                <h3 className="font-bold text-lg">{course.instructorInfo.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Course Instructor
                </p>
                
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.rating?.toFixed(1) || 'N/A'}</p>
                    <p className="text-xs text-zinc-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">
                      {(course.instructorInfo.students / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-zinc-400">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.courses || 'N/A'}</p>
                    <p className="text-xs text-zinc-400">Courses</p>
                  </div>
                </div>
                
                {/* <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium">
                  View Profile
                </button> */}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">About the Instructor</h2>
              <p className="text-zinc-300 mb-6">{course.instructorInfo.bio}</p>
              
              {/* <h3 className="font-bold mb-4">Instructor's Courses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((courseId) => (
                  <div
                    key={courseId}
                    className="bg-zinc-800 rounded-lg p-4 flex"
                  >
                    <div className="bg-zinc-700 rounded w-16 h-16 flex-shrink-0"></div>
                    <div className="ml-4">
                      <h4 className="font-medium">Another Course Title</h4>
                      <p className="text-sm text-zinc-400 mt-1">4.7 (8.2k)</p>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;