// components/CourseCard.jsx
import React from 'react';
import { Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const CourseCard = ({ course }) => {
  // Determine price display
  const priceDisplay = course.access_type === 'free' ? (
    <span className="text-lg font-bold text-green-500">Free</span>
  ) : (
    <span className="text-lg font-bold">{'0.00'}</span>
  );

  return (
    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {/* Use a placeholder if thumbnail is missing or invalid */}
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/600x400/18181b/ffffff?text=Course+Image'; }} // Fallback image
          />
        ) : (
          <div className="bg-zinc-700 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
            <span className="text-zinc-500">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {course.subject} {/* Changed from category to subject to match backend */}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
          <div className="flex items-center bg-amber-500/20 text-amber-400 text-sm px-2 py-1 rounded">
            <Star size={14} className="fill-current" />
            <span className="ml-1">
              {/* Mock rating if not provided by backend */}
              {course.rating ? course.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Display teacher name if available */}
        <p className="mt-2 text-zinc-400 text-sm">
          By {course.teacher_name || course.instructor_name || "Unknown Instructor"}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-zinc-500">
            <Users size={16} />
            {/* Mock student count if not provided by backend */}
            <span className="ml-1">
              {course.enrollment_count
                ? `${(course.enrollment_count / 1000).toFixed(1)}k students`
                : 'N/A students'}
            </span>
          </div>
          {priceDisplay}
        </div>

        {/* Link to the course detail page */}
        <Link
          to={`/courses/${course.id}`} // Navigate to detail page
          className="mt-4 w-full bg-zinc-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition duration-300 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;