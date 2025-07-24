// components/CourseCard.jsx
import React from 'react';
import { Star, Users } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {course.category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
          <div className="flex items-center bg-amber-500/20 text-amber-400 text-sm px-2 py-1 rounded">
            <Star size={14} className="fill-current" />
            <span className="ml-1">{course.rating}</span>
          </div>
        </div>
        
        <p className="mt-2 text-zinc-400 text-sm">By {course.instructor}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-zinc-500">
            <Users size={16} />
            <span className="ml-1">{(course.students / 1000).toFixed(1)}k students</span>
          </div>
          <div className="text-lg font-bold">${course.price}</div>
        </div>
        
        <button className="mt-4 w-full bg-zinc-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition duration-300">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseCard;