// components/CourseCard.jsx
import React from 'react';
import { Star, Users, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const CourseCard = ({ course, isTeacher = false, onDelete, onEdit, isDeleting = false }) => {
  // --- Determine price display (FIXED) ---
  // Ensure course.price is a valid number before calling toFixed
  let priceDisplay;
  const priceValue = parseFloat(course.price); // Attempt to convert to number

  if (isNaN(priceValue) || priceValue <= 0) {
    // If price is not a valid number, is 0, or negative, show 'Free'
    priceDisplay = <span className="text-lg font-bold text-green-500">Free</span>;
  } else {
    // If it's a valid positive number, format it
    priceDisplay = <span className="text-lg font-bold">${priceValue.toFixed(2)}</span>;
  }

  // --- Determine card link destination ---
  // Teachers might go to a detailed view or directly to editing, students go to detail.
  // Adjust these paths according to your routing setup.
  const cardLink = isTeacher ? `/course-detail/${course.id}` : `/courses/${course.id}`;

  return (
    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 group"> {/* Added 'group' for hover effects */}
      <Link to={cardLink} className="block">
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
            {course.subject || course.category || "General"} {/* Use subject, fallback to category or General */}
          </div>

          {/* --- Teacher Action Buttons (Rendered conditionally) --- */}
          {/* Shown on hover for teachers */}
          {isTeacher && (
            <div className="absolute top-3 left-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent Link navigation
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 text-zinc-200 bg-zinc-900/70 hover:text-indigo-400 hover:bg-zinc-800 rounded-md transition-colors"
                  aria-label="Edit course"
                  // disabled={isDeleting} // Generally, editing is independent of deleting
                >
                  {/* Simple Pencil Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent Link navigation
                    e.stopPropagation();
                    onDelete();
                  }}
                  className={`p-1.5 text-zinc-200 bg-zinc-900/70 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isDeleting ? "Deleting..." : "Delete course"}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    // Simple Spinner SVG
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    // Simple Trash Icon SVG
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}

        </div>

        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
            <div className="flex items-center bg-amber-500/20 text-amber-400 text-sm px-2 py-1 rounded">
              <Star size={14} className="fill-current" />
              <span className="ml-1">
                {/* Display rating or N/A */}
                {/* Also ensure rating is a number */}
                {course.rating && !isNaN(parseFloat(course.rating)) ? parseFloat(course.rating).toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Display teacher name if available */}
          <p className="mt-2 text-zinc-400 text-sm">
            By {isTeacher ? "You" : (course.teacher_name || course.instructor_name || "Unknown Instructor")}
          </p>

          {/* --- Additional Info for Teachers --- */}
          {isTeacher && (
             <div className="flex items-center text-sm text-zinc-500 mt-2 mb-1">
               <Users className="h-4 w-4 mr-1" />
               <span className="mr-3">{course.enrollment_count || 0} students</span>
               <Clock className="h-4 w-4 mr-1" />
               <span>{course.duration || 'N/A'} hrs</span>
             </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-zinc-500">
              <Users size={16} />
              <span className="ml-1">
                {course.enrollment_count
                  ? `${(course.enrollment_count).toLocaleString()} students` // Show actual count
                  : '0 students'}
              </span>
            </div>
            {priceDisplay} {/* Use the fixed priceDisplay */}
          </div>

          {/* Link to the course detail page */}
          <Link
            to={cardLink} // Navigate to detail page
            className="mt-4 w-full bg-zinc-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition duration-300 text-center block"
          >
            {isTeacher ? "Manage Course" : "View Details"}
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;