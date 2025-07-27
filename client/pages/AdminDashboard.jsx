// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { apiFetch } from '../src/utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userEditMode, setUserEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [userEditData, setUserEditData] = useState({});
  const { user } = useAuth();

  // Fetch data when component mounts or active tab changes
  useEffect(() => {
    if (!user?.token) {
      setError('Authentication token missing');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch users for stats and users tab
        const usersResponse = await apiFetch('http://localhost:5000/api/users/admin/all-users');
        let fetchedUsers = [];
        if (usersResponse && Array.isArray(usersResponse.users)) {
          fetchedUsers = usersResponse.users;
          setUsers(fetchedUsers);
        } else {
          console.warn('Unexpected API response structure for users:', usersResponse);
          fetchedUsers = [];
        }

        // Fetch courses if on courses tab or for stats
        let fetchedCourses = [];
        if (activeTab === 'courses' || activeTab === 'stats') {
          const coursesResponse = await apiFetch('http://localhost:5000/api/users/get-all-courses');
          fetchedCourses = Array.isArray(coursesResponse) ? coursesResponse : [];
          setCourses(fetchedCourses);
        }

        // Calculate stats
        setStats({
          totalUsers: fetchedUsers.length,
          totalCourses: fetchedCourses.length,
          totalStudents: fetchedUsers.filter(u => u.role === 'student').length,
          totalTeachers: fetchedUsers.filter(u => u.role === 'teacher').length,
          totalAdmins: fetchedUsers.filter(u => u.role === 'admin').length,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 403) {
          setError('Access Denied: You do not have permission to view this page.');
        } else if (err.response?.status === 401) {
          setError('Unauthorized: Please log in again.');
        } else {
          setError('Failed to load data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token, activeTab]);

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete the user "${userName}" (ID: ${userId})? This action cannot be undone.`)) return;

    try {
      await apiFetch(`http://localhost:5000/api/users/delete-user/${userId}`, {
        method: 'DELETE',
      });
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        totalStudents: prev.totalStudents - (users.find(u => u.id === userId)?.role === 'student' ? 1 : 0),
        totalTeachers: prev.totalTeachers - (users.find(u => u.id === userId)?.role === 'teacher' ? 1 : 0),
        totalAdmins: prev.totalAdmins - (users.find(u => u.id === userId)?.role === 'admin' ? 1 : 0),
      }));
      alert(`User "${userName}" deleted successfully.`);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user "${userName}". ${err.message || 'Unknown error'}`);
    }
  };

  // Handle teacher's courses deletion
  const handleDeleteUserCourses = async (teacherId, teacherName) => {
    if (!window.confirm(`Are you sure you want to delete ALL courses created by "${teacherName}" (ID: ${teacherId})? This action cannot be undone and will affect enrolled students.`)) return;

    try {
      const response = await apiFetch(`http://localhost:5000/api/users/admin/delete-courses-by-teacher/${teacherId}`, {
        method: 'DELETE',
      });
      if (activeTab === 'courses') {
        const coursesResponse = await apiFetch('http://localhost:5000/api/users/get-all-courses');
        setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
        setStats(prev => ({ ...prev, totalCourses: coursesResponse.length }));
      }
      alert(response.message || `Courses for "${teacherName}" deleted successfully.`);
    } catch (err) {
      console.error('Error deleting user courses:', err);
      alert(`Failed to delete courses for "${teacherName}". ${err.message || 'Unknown error'}`);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete the course "${courseTitle}" (ID: ${courseId})? This action cannot be undone.`)) return;

    try {
      await apiFetch(`http://localhost:5000/api/users/course-delete/${courseId}`, {
        method: 'DELETE',
      });
      setCourses(prevCourses => prevCourses.filter(c => c.id !== courseId));
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
      alert(`Course "${courseTitle}" deleted successfully.`);
    } catch (err) {
      console.error('Error deleting course:', err);
      alert(`Failed to delete course "${courseTitle}". ${err.message || 'Unknown error'}`);
    }
  };

  // Handle user role update
  const handleUpdateUserRole = async (userId, userName, newRole) => {
    if (!window.confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) return;

    try {
      await apiFetch(`http://localhost:5000/api/users/update-profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setStats(prev => ({
        ...prev,
        totalStudents: prev.totalStudents - (users.find(u => u.id === userId)?.role === 'student' ? 1 : 0) + (newRole === 'student' ? 1 : 0),
        totalTeachers: prev.totalTeachers - (users.find(u => u.id === userId)?.role === 'teacher' ? 1 : 0) + (newRole === 'teacher' ? 1 : 0),
        totalAdmins: prev.totalAdmins - (users.find(u => u.id === userId)?.role === 'admin' ? 1 : 0) + (newRole === 'admin' ? 1 : 0),
      }));
      alert(`User "${userName}" role updated to ${newRole} successfully.`);
    } catch (err) {
      console.error('Error updating user role:', err);
      alert(`Failed to update user "${userName}" role. ${err.message || 'Unknown error'}`);
    }
  };

  // Handle user profile update
  const handleUpdateUserProfile = async (userId) => {
    try {
      await apiFetch(`http://localhost:5000/api/users/update-profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userEditData),
      });
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...userEditData } : u));
      setUserEditMode(false);
      setUserEditData({});
      setSelectedUser(null);
      alert('User profile updated successfully.');
    } catch (err) {
      console.error('Error updating user profile:', err);
      alert(`Failed to update user profile. ${err.message || 'Unknown error'}`);
    }
  };

  // Handle course update
  const handleUpdateCourse = async (courseId) => {
    try {
      await apiFetch(`http://localhost:5000/api/users/course-update/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(editData),
      });
      setCourses(prevCourses => prevCourses.map(c => c.id === courseId ? { ...c, ...editData } : c));
      setEditMode(false);
      setEditData({});
      setSelectedCourse(null);
      alert('Course updated successfully.');
    } catch (err) {
      console.error('Error updating course:', err);
      alert(`Failed to update course. ${err.message || 'Unknown error'}`);
    }
  };

  // Handle course status toggle
  const handleToggleCourseStatus = async (courseId, isActive) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'deactivate' : 'activate'} the course (ID: ${courseId})?`)) return;

    try {
      await apiFetch(`http://localhost:5000/api/users/course-update/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !isActive }),
      });
      setCourses(prevCourses => prevCourses.map(c => c.id === courseId ? { ...c, is_active: !isActive } : c));
      alert(`Course ${isActive ? 'deactivated' : 'activated'} successfully.`);
    } catch (err) {
      console.error('Error toggling course status:', err);
      alert(`Failed to toggle course status. ${err.message || 'Unknown error'}`);
    }
  };

  // Handle view course details
  const handleViewCourseDetails = async (courseId) => {
    try {
      const response = await apiFetch(`http://localhost:5000/api/users/course-detail/${courseId}`);
      setSelectedCourse(response);
    } catch (err) {
      console.error('Error fetching course details:', err);
      alert(`Failed to fetch course details. ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="text-center py-8">Loading data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} rounded-t-lg`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} rounded-t-lg`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} rounded-t-lg`}
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses
        </button>
      </div>

      {/* Statistics Dashboard */}
      {activeTab === 'stats' && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Users</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-600 p-3 rounded">
                  <p className="text-sm">Total</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-gray-600 p-3 rounded">
                  <p className="text-sm">Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <div className="bg-gray-600 p-3 rounded">
                  <p className="text-sm">Teachers</p>
                  <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </div>
                <div className="bg-gray-600 p-3 rounded">
                  <p className="text-sm">Admins</p>
                  <p className="text-2xl font-bold">{stats.totalAdmins}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Courses</h3>
              <div className="bg-gray-600 p-3 rounded">
                <p className="text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-600">ID</th>
                    <th className="py-2 px-4 border-b border-gray-600">Name</th>
                    <th className="py-2 px-4 border-b border-gray-600">Email</th>
                    <th className="py-2 px-4 border-b border-gray-600">Role</th>
                    <th className="py-2 px-4 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-600">
                      <td className="py-2 px-4 border-b border-gray-600">{userData.id}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{userData.name}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{userData.email}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{userData.role}</td>
                      <td className="py-2 px-4 border-b border-gray-600">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewUserDetails(userData.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                            title="View User Details"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setUserEditMode(true);
                              setUserEditData({
                                name: userData.name,
                                email: userData.email,
                                phone: userData.phone || '',
                                bio: userData.bio || '',
                                location: userData.location || '',
                                role: userData.role,
                              });
                              setSelectedUser(userData);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                            title="Edit User"
                          >
                            Edit User
                          </button>
                          {userData.role !== 'admin' && (
                            <button
                              onClick={() => handleUpdateUserRole(userData.id, userData.name, 'admin')}
                              className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm"
                              title="Promote to Admin"
                            >
                              Make Admin
                            </button>
                          )}
                          {userData.role !== 'teacher' && (
                            <button
                              onClick={() => handleUpdateUserRole(userData.id, userData.name, 'teacher')}
                              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                              title="Promote to Teacher"
                            >
                              Make Teacher
                            </button>
                          )}
                          {userData.role !== 'student' && (
                            <button
                              onClick={() => handleUpdateUserRole(userData.id, userData.name, 'student')}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                              title="Change to Student"
                            >
                              Make Student
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(userData.id, userData.name)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                            disabled={userData.role === 'admin'}
                            title={userData.role === 'admin' ? 'Cannot delete admin users' : 'Delete User'}
                          >
                            Delete User
                          </button>
                          {userData.role === 'teacher' && (
                            <button
                              onClick={() => handleDeleteUserCourses(userData.id, userData.name)}
                              className="bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm"
                              title="Delete All Courses Created by this Teacher"
                            >
                              Delete Courses
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User Details Modal */}
          {selectedUser && !userEditMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">User Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">ID:</p>
                    <p>{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Name:</p>
                    <p>{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email:</p>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Role:</p>
                    <p>{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone:</p>
                    <p>{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Location:</p>
                    <p>{selectedUser.location || 'Not provided'}</p>
                  </div>
                  {selectedUser.role === 'teacher' && (
                    <>
                      <div>
                        <p className="text-gray-400">Subject:</p>
                        <p>{selectedUser.subject || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Qualification:</p>
                        <p>{selectedUser.qualification || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Experience:</p>
                        <p>{selectedUser.experience_years ? `${selectedUser.experience_years} years` : 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">LinkedIn:</p>
                        <p>{selectedUser.linkedin || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Availability:</p>
                        <p>{selectedUser.availability || 'Not provided'}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">Bio:</p>
                  <p className="mt-1">{selectedUser.bio || 'No bio provided'}</p>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Edit Modal */}
          {selectedUser && userEditMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Edit User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={userEditData.name || ''}
                      onChange={(e) => setUserEditData({ ...userEditData, name: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={userEditData.email || ''}
                      onChange={(e) => setUserEditData({ ...userEditData, email: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={userEditData.phone || ''}
                      onChange={(e) => setUserEditData({ ...userEditData, phone: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={userEditData.location || ''}
                      onChange={(e) => setUserEditData({ ...userEditData, location: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 mb-1">Bio</label>
                    <textarea
                      value={userEditData.bio || ''}
                      onChange={(e) => setUserEditData({ ...userEditData, bio: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-32"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setUserEditMode(false);
                      setUserEditData({});
                      setSelectedUser(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateUserProfile(selectedUser.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Courses Management */}
      {activeTab === 'courses' && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-600">ID</th>
                    <th className="py-2 px-4 border-b border-gray-600">Title</th>
                    <th className="py-2 px-4 border-b border-gray-600">Subject</th>
                    <th className="py-2 px-4 border-b border-gray-600">Instructor</th>
                    <th className="py-2 px-4 border-b border-gray-600">Access</th>
                    <th className="py-2 px-4 border-b border-gray-600">Status</th>
                    <th className="py-2 px-4 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-600">
                      <td className="py-2 px-4 border-b border-gray-600">{course.id}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{course.title}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{course.subject || 'N/A'}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{course.instructor_name}</td>
                      <td className="py-2 px-4 border-b border-gray-600">{course.access_type}</td>
                      <td className="py-2 px-4 border-b border-gray-600">
                        <span className={`px-2 py-1 rounded text-xs ${course.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                          {course.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-600">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewCourseDetails(course.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                            title="View Course Details"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setEditMode(true);
                              setEditData({
                                title: course.title,
                                subject: course.subject,
                                description: course.description,
                                access_type: course.access_type,
                                price: course.price,
                                is_active: course.is_active,
                              });
                              setSelectedCourse(course);
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                            title="Edit Course"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleCourseStatus(course.id, course.is_active)}
                            className={`${course.is_active ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white py-1 px-3 rounded text-sm`}
                            title={course.is_active ? 'Deactivate Course' : 'Activate Course'}
                          >
                            {course.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                            title="Delete Course"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Course Details Modal */}
          {selectedCourse && !editMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Course Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">ID:</p>
                    <p>{selectedCourse.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Title:</p>
                    <p>{selectedCourse.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Subject:</p>
                    <p>{selectedCourse.subject || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Instructor:</p>
                    <p>{selectedCourse.instructor_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Access Type:</p>
                    <p>{selectedCourse.access_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Price:</p>
                    <p>{selectedCourse.price ? `$${selectedCourse.price}` : 'Free'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Level:</p>
                    <p>{selectedCourse.level || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Duration:</p>
                    <p>{selectedCourse.duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <p>{selectedCourse.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created:</p>
                    <p>{new Date(selectedCourse.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">Description:</p>
                  <p className="mt-1">{selectedCourse.description || 'No description provided'}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-400">Material URL:</p>
                  <p className="mt-1">
                    {selectedCourse.material_url ? (
                      <a href={selectedCourse.material_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {selectedCourse.material_url}
                      </a>
                    ) : 'No materials provided'}
                  </p>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Course Edit Modal */}
          {selectedCourse && editMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Edit Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={editData.subject || ''}
                      onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Access Type</label>
                    <select
                      value={editData.access_type || 'free'}
                      onChange={(e) => setEditData({ ...editData, access_type: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Price</label>
                    <input
                      type="number"
                      value={editData.price || ''}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      disabled={editData.access_type === 'free'}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Status</label>
                    <select
                      value={editData.is_active ? '1' : '0'}
                      onChange={(e) => setEditData({ ...editData, is_active: e.target.value === '1' })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-32"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData({});
                      setSelectedCourse(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateCourse(selectedCourse.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;