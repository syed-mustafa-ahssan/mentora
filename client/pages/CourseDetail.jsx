// pages/CourseDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  Play, 
  Download,
  CheckCircle,
  ChevronRight,
  Award
} from 'lucide-react';
import { useAuth } from '../src/App';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(1);

  // Mock course data - replace with actual API call
  const course = {
    id: 1,
    title: "Advanced React Development",
    instructor: "Alex Johnson",
    rating: 4.8,
    students: 12400,
    price: 89.99,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Web Development",
    level: "Intermediate",
    duration: "12 hours",
    description: "Master advanced React concepts including hooks, context API, performance optimization, and modern patterns. This comprehensive course will take your React skills to the next level.",
    learningOutcomes: [
      "Master advanced React hooks (useMemo, useCallback, useReducer)",
      "Implement state management with Context API",
      "Optimize React application performance",
      "Build reusable component libraries",
      "Understand React internals and reconciliation",
      "Work with modern React patterns and best practices"
    ],
    modules: [
      {
        id: 1,
        title: "Advanced Hooks",
        lessons: 8,
        duration: "2h 15m",
        topics: [
          "useMemo and useCallback",
          "useReducer for complex state",
          "Custom hooks creation",
          "Performance optimization techniques"
        ]
      },
      {
        id: 2,
        title: "State Management",
        lessons: 6,
        duration: "1h 45m",
        topics: [
          "Context API deep dive",
          "State lifting patterns",
          "Third-party libraries integration",
          "Global state management"
        ]
      },
      {
        id: 3,
        title: "Performance Optimization",
        lessons: 7,
        duration: "2h 30m",
        topics: [
          "React.memo and memoization",
          "Code splitting with React.lazy",
          "Bundle optimization",
          "Profiling and debugging"
        ]
      },
      {
        id: 4,
        title: "Advanced Patterns",
        lessons: 5,
        duration: "1h 50m",
        topics: [
          "Render props pattern",
          "Higher-order components",
          "Compound components",
          "Provider pattern"
        ]
      }
    ],
    instructorInfo: {
      name: "Alex Johnson",
      bio: "Senior Frontend Engineer with 10+ years of experience. Specializes in React ecosystem and modern JavaScript. Has taught over 50,000 students worldwide.",
      rating: 4.9,
      students: 85000,
      courses: 12,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'curriculum', name: 'Curriculum' },
    { id: 'instructor', name: 'Instructor' },
    { id: 'reviews', name: 'Reviews' }
  ];

  return (
    <div className="py-8">
      {/* Course Header */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          <div className="p-6 md:w-1/3">
            <div className="flex items-center bg-indigo-500/20 text-indigo-400 text-xs font-semibold px-2 py-1 rounded mb-3 inline-block">
              {course.category}
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-zinc-300 mb-4">{course.instructor}</p>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-amber-500/20 text-amber-400 text-sm px-2 py-1 rounded">
                <Star size={14} className="fill-current" />
                <span className="ml-1 font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center text-sm text-zinc-400 ml-3">
                <Users size={16} className="mr-1" />
                <span>{(course.students / 1000).toFixed(1)}k students</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-zinc-400 mb-6">
              <Clock size={16} className="mr-1" />
              <span>{course.duration} • {course.level}</span>
            </div>
            
            {!isAuthenticated ? (
              <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                <p className="text-center text-zinc-300 mb-3">
                  Sign in to enroll in this course
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium">
                  Sign In to Enroll
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">${course.price}</p>
                  <p className="text-sm text-zinc-400 line-through">$129.99</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium">
                  Enroll Now
                </button>
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
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-zinc-300 mb-8">
                {course.description}
              </p>
              
              <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
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
                  <span className="text-zinc-300">Basic knowledge of HTML, CSS, and JavaScript</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">Familiarity with React fundamentals</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                  <span className="text-zinc-300">Node.js installed on your machine</span>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="bg-zinc-800 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Course Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Play className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">32 on-demand video lectures</span>
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
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="text-zinc-300">Access on mobile and TV</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'curriculum' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="bg-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    className="w-full flex justify-between items-center p-5 text-left"
                  >
                    <div>
                      <h3 className="font-bold text-lg">Module {module.id}: {module.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1">
                        {module.lessons} lessons • {module.duration}
                      </p>
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 text-zinc-400 transform transition-transform ${
                        expandedModule === module.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedModule === module.id && (
                    <div className="px-5 pb-5 border-t border-zinc-700 pt-4">
                      <ul className="space-y-3">
                        {module.topics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <Play className="h-4 w-4 text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                            <span className="text-zinc-300">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'instructor' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-zinc-800 rounded-xl p-6 text-center">
                <img 
                  src={course.instructorInfo.avatar} 
                  alt={course.instructorInfo.name} 
                  className="h-24 w-24 rounded-full mx-auto mb-4"
                />
                <h3 className="font-bold text-lg">{course.instructorInfo.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">Senior Frontend Engineer</p>
                
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="font-bold">{course.instructorInfo.rating}</p>
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
                
                <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">About the Instructor</h2>
              <p className="text-zinc-300 mb-6">
                {course.instructorInfo.bio}
              </p>
              
              <h3 className="font-bold mb-4">Instructor's Courses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3].map((courseId) => (
                  <div key={courseId} className="bg-zinc-800 rounded-lg p-4 flex">
                    <div className="bg-zinc-700 rounded w-16 h-16 flex-shrink-0"></div>
                    <div className="ml-4">
                      <h4 className="font-medium">React Fundamentals</h4>
                      <p className="text-sm text-zinc-400 mt-1">4.8 (12.4k)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Student Reviews</h2>
              <div className="flex items-center">
                <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded mr-3">
                  <span className="font-bold">{course.rating}</span>
                  <Star size={14} className="inline fill-current ml-1" />
                </div>
                <p className="text-zinc-400">{course.students.toLocaleString()} reviews</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[1, 2, 3, 4].map((reviewId) => (
                <div key={reviewId} className="bg-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-zinc-700 rounded-full w-10 h-10"></div>
                      <div className="ml-3">
                        <h4 className="font-medium">Sarah Johnson</h4>
                        <p className="text-xs text-zinc-400">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${
                            i < 5 ? 'text-amber-400 fill-current' : 'text-zinc-600'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300">
                    This course completely transformed my understanding of React. The instructor explains complex concepts in a very accessible way. Highly recommended for anyone looking to level up their React skills!
                  </p>
                </div>
              ))}
            </div>
            
            {!isAuthenticated && (
              <div className="bg-zinc-800 rounded-xl p-8 text-center">
                <h3 className="font-bold text-lg mb-2">Sign in to leave a review</h3>
                <p className="text-zinc-400 mb-4">
                  Share your experience with this course
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium">
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;