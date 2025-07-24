// pages/Home.jsx
import React, { useState } from 'react';
import CourseCard from '../component/CourseCard';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock course data - replace with actual data fetching
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Alex Johnson",
      rating: 4.8,
      students: 12400,
      price: 89.99,
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Web Development"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Chen",
      rating: 4.9,
      students: 9800,
      price: 79.99,
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Design"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Michael Rodriguez",
      rating: 4.7,
      students: 15600,
      price: 99.99,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Data Science"
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      instructor: "Emma Wilson",
      rating: 4.6,
      students: 8700,
      price: 69.99,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Marketing"
    },
    {
      id: 5,
      title: "Python for Beginners",
      instructor: "David Kim",
      rating: 4.9,
      students: 21500,
      price: 59.99,
      thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c892?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Programming"
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "James Peterson",
      rating: 4.8,
      students: 11200,
      price: 84.99,
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Mobile Development"
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
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
              <a 
                href="#courses" 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Explore Courses
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Find Your Perfect Course</h2>
          <p className="mt-2 text-zinc-400">
            Search from our extensive library of courses
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, instructors, or categories..."
            className="block w-full pl-10 pr-3 py-4 border border-zinc-700 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <p className="mt-2 text-zinc-400">
              Hand-picked courses for your career growth
            </p>
          </div>
          <div>
            <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center">
              View All
              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No courses found</h3>
            <p className="mt-1 text-zinc-500">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;