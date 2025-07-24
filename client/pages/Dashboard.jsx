import React from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  Calendar,
  CheckCircle,
  PlayCircle,
  Star
} from 'lucide-react';
import CourseProgressCard from '../component/CourseProgressCard';
import StatCard from '../component/StatCard';


const Dashboard = () => {
  // Mock data - replace with actual API data
  const stats = {
    enrolledCourses: 8,
    completedCourses: 3,
    totalHours: 42,
    certificates: 2
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Alex Johnson",
      progress: 75,
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Web Development",
      lastAccessed: "2 days ago"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Chen",
      progress: 40,
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Design",
      lastAccessed: "1 week ago"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Michael Rodriguez",
      progress: 90,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Data Science",
      lastAccessed: "3 days ago"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Completed",
      course: "JavaScript Mastery",
      timestamp: "2 hours ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 2,
      action: "Started",
      course: "Mobile App Development",
      timestamp: "1 day ago",
      icon: <PlayCircle className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 3,
      action: "Earned Certificate",
      course: "Python for Beginners",
      timestamp: "3 days ago",
      icon: <Award className="h-5 w-5 text-amber-500" />
    },
    {
      id: 4,
      action: "Rated",
      course: "UI/UX Design Masterclass",
      timestamp: "1 week ago",
      icon: <Star className="h-5 w-5 text-amber-400" />
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Final Project Submission",
      course: "Advanced React Development",
      dueDate: "Dec 15, 2023",
      daysLeft: 5
    },
    {
      id: 2,
      title: "Quiz: State Management",
      course: "Advanced React Development",
      dueDate: "Dec 10, 2023",
      daysLeft: 0
    },
    {
      id: 3,
      title: "Assignment 3: Prototyping",
      course: "UI/UX Design Masterclass",
      dueDate: "Dec 20, 2023",
      daysLeft: 10
    }
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Welcome back! Here's your learning progress overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Enrolled Courses" 
          value={stats.enrolledCourses} 
          icon={<BookOpen className="h-6 w-6 text-indigo-500" />} 
          change="+2 this month"
        />
        <StatCard 
          title="Completed Courses" 
          value={stats.completedCourses} 
          icon={<CheckCircle className="h-6 w-6 text-green-500" />} 
          change="1 this week"
        />
        <StatCard 
          title="Learning Hours" 
          value={stats.totalHours} 
          icon={<Clock className="h-6 w-6 text-amber-500" />} 
          change="+8 hours"
        />
        <StatCard 
          title="Certificates" 
          value={stats.certificates} 
          icon={<Award className="h-6 w-6 text-purple-500" />} 
          change="+1 this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Courses */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Learning Progress</h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View All Courses
              </button>
            </div>
            
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-lg font-medium">No enrolled courses</h3>
                <p className="mt-1 text-zinc-500">
                  Start learning by enrolling in a course
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {enrolledCourses.map(course => (
                  <CourseProgressCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                View Calendar
              </button>
            </div>
            
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-lg font-medium">No upcoming deadlines</h3>
                <p className="mt-1 text-zinc-500">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-700">
                {upcomingDeadlines.map(deadline => (
                  <li key={deadline.id} className="py-4">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        deadline.daysLeft === 0 
                          ? 'bg-red-500/20 text-red-500' 
                          : deadline.daysLeft <= 3 
                            ? 'bg-amber-500/20 text-amber-500' 
                            : 'bg-indigo-500/20 text-indigo-500'
                      }`}>
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{deadline.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            deadline.daysLeft === 0 
                              ? 'bg-red-500/20 text-red-500' 
                              : deadline.daysLeft <= 3 
                                ? 'bg-amber-500/20 text-amber-500' 
                                : 'bg-zinc-700 text-zinc-300'
                          }`}>
                            {deadline.daysLeft === 0 ? 'Due today' : `${deadline.daysLeft} days left`}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{deadline.course}</p>
                        <p className="text-xs text-zinc-500 mt-1">Due: {deadline.dueDate}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-zinc-600" />
                <h3 className="mt-4 text-lg font-medium">No recent activity</h3>
                <p className="mt-1 text-zinc-500">
                  Your learning activities will appear here
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {activity.icon}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span>{' '}
                        <span className="text-zinc-400">"{activity.course}"</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Learning Streak */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-center">
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold">7-Day Learning Streak!</h3>
                <p className="text-sm text-zinc-300 mt-1">
                  Keep it up to maintain your streak
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div 
                  key={day} 
                  className={`h-2 flex-1 rounded-full ${
                    day <= 7 ? 'bg-indigo-500' : 'bg-zinc-700'
                  }`}
                ></div>
              ))}
            </div>
            <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition duration-300">
              Continue Learning
            </button>
          </div>

          {/* Achievements */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Quick Learner</h3>
                  <p className="text-xs text-zinc-400">Completed 5 courses</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Top Performer</h3>
                  <p className="text-xs text-zinc-400">Scored 95%+ in 3 courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;