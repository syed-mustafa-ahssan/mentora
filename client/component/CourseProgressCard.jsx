import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

const CourseProgressCard = ({ course }) => {
  return (
    <div className="flex items-center p-4 bg-zinc-900 rounded-lg border border-zinc-700 hover:border-indigo-500 transition-colors">
      <div className="flex-shrink-0">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="h-16 w-16 rounded-lg object-cover"
        />
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <h3 className="font-medium truncate">{course.title}</h3>
        <p className="text-sm text-zinc-400 mt-1">{course.instructor}</p>
        <div className="mt-2 flex items-center text-xs text-zinc-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>Last accessed {course.lastAccessed}</span>
        </div>
      </div>
      <div className="ml-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{course.progress}%</span>
        </div>
        <div className="w-32 bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
          Continue
        </button>
      </div>
    </div>
  );
};

export default CourseProgressCard;