// pages/Courses.jsx
import React, { useState, useMemo } from 'react';
import CourseCard from '../component/CourseCard';


const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  // Mock course data - replace with actual API data
  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Alex Johnson",
      rating: 4.8,
      students: 12400,
      price: 89.99,
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Web Development",
      level: "Intermediate",
      duration: "12 hours"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Chen",
      rating: 4.9,
      students: 9800,
      price: 79.99,
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Design",
      level: "Beginner",
      duration: "18 hours"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Michael Rodriguez",
      rating: 4.7,
      students: 15600,
      price: 99.99,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Data Science",
      level: "Advanced",
      duration: "24 hours"
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      instructor: "Emma Wilson",
      rating: 4.6,
      students: 8700,
      price: 69.99,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Marketing",
      level: "Intermediate",
      duration: "15 hours"
    },
    {
      id: 5,
      title: "Python for Beginners",
      instructor: "David Kim",
      rating: 4.9,
      students: 21500,
      price: 59.99,
      thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c892?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Programming",
      level: "Beginner",
      duration: "20 hours"
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "James Peterson",
      rating: 4.8,
      students: 11200,
      price: 84.99,
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Mobile Development",
      level: "Intermediate",
      duration: "30 hours"
    },
    {
      id: 7,
      title: "Machine Learning Essentials",
      instructor: "Dr. Amanda Lee",
      rating: 4.9,
      students: 13400,
      price: 109.99,
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Data Science",
      level: "Advanced",
      duration: "35 hours"
    },
    {
      id: 8,
      title: "JavaScript Mastery",
      instructor: "Robert Chen",
      rating: 4.7,
      students: 18900,
      price: 74.99,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Web Development",
      level: "Intermediate",
      duration: "22 hours"
    },
    {
      id: 9,
      title: "Graphic Design Fundamentals",
      instructor: "Sophie Turner",
      rating: 4.6,
      students: 7600,
      price: 64.99,
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Design",
      level: "Beginner",
      duration: "14 hours"
    },
    {
      id: 10,
      title: "SEO Optimization Strategies",
      instructor: "Mark Thompson",
      rating: 4.5,
      students: 9200,
      price: 54.99,
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Marketing",
      level: "Intermediate",
      duration: "10 hours"
    },
    {
      id: 11,
      title: "iOS App Development",
      instructor: "Kevin Adams",
      rating: 4.8,
      students: 10500,
      price: 89.99,
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Mobile Development",
      level: "Advanced",
      duration: "28 hours"
    },
    {
      id: 12,
      title: "Cybersecurity Fundamentals",
      instructor: "Lisa Rodriguez",
      rating: 4.9,
      students: 14200,
      price: 94.99,
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Security",
      level: "Intermediate",
      duration: "25 hours"
    }
  ];

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(courses.map(course => course.category))];

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let result = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort courses
    switch (sortBy) {
      case 'popular':
        return result.sort((a, b) => b.students - a.students);
      case 'rating':
        return result.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return result.sort((a, b) => b.id - a.id);
      case 'price-low':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high':
        return result.sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [courses, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredAndSortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="py-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">All Courses</h1>
        <p className="mt-2 text-zinc-400">
          Browse our extensive library of professional courses
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-800 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-zinc-300 mb-1">
              Search Courses
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, instructors..."
                className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full py-3 px-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-zinc-300 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full py-3 px-3 border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <p className="text-zinc-400">
          Showing <span className="text-white font-medium">{currentCourses.length}</span> of{' '}
          <span className="text-white font-medium">{filteredAndSortedCourses.length}</span> courses
        </p>
        <div className="mt-2 md:mt-0">
          <p className="text-zinc-400 text-sm">
            Page {currentPage} of {totalPages || 1}
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {currentCourses.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium">No courses found</h3>
          <p className="mt-2 text-zinc-500">
            Try adjusting your search or filter criteria
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy('popular');
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === 1 
                      ? 'text-zinc-600 cursor-not-allowed' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === totalPages 
                      ? 'text-zinc-600 cursor-not-allowed' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;