import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../src/contexts/AuthContext';


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            console.log("Attempting API call with token:", user?.token);
            if (!user?.token) {
                setError('Authentication token missing');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/users/admin/all-users', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                let fetchedUsers = [];
                if (response.data && Array.isArray(response.data.users)) {
                    fetchedUsers = response.data.users;
                } else {
                    console.warn('Unexpected API response structure for users:', response.data);
                }
                setUsers(fetchedUsers);
                setError(null);
            } catch (err) {
                console.error('Error fetching users:', err);
                if (err.response?.status === 403) {
                    setError('Access Denied: You do not have permission to view this page.');
                } else if (err.response?.status === 401) {
                    setError('Unauthorized: Please log in again.');
                } else {
                    setError('Failed to load users. Please try again later.');
                }
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user?.token]);

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete the user "${userName}" (ID: ${userId})? This action cannot be undone.`)) return;

        if (!user?.token) {
            alert('Authentication required.');
            return;
        }

        try {
            await axios.delete(`/api/users/delete-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setUsers(users.filter(u => u.id !== userId));
            alert(`User "${userName}" deleted successfully.`);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert(`Failed to delete user "${userName}". ${err.response?.data?.error || ''}`);
        }
    };

    const handleDeleteUserCourses = async (teacherId, teacherName) => {
        if (!window.confirm(`Are you sure you want to delete ALL courses created by "${teacherName}" (ID: ${teacherId})? This action cannot be undone and will affect enrolled students.`)) return;

        if (!user?.token) {
            alert('Authentication required.');
            return;
        }

        try {
            const response = await axios.delete(`/api/users/admin/delete-courses-by-teacher/${teacherId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            alert(response.data.message || `Courses for "${teacherName}" deleted successfully.`);
        } catch (err) {
            console.error('Error deleting user courses:', err);
            alert(`Failed to delete courses for "${teacherName}". ${err.response?.data?.error || ''}`);
        }
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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
                                                    onClick={() => handleDeleteUser(userData.id, userData.name)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                                                    disabled={userData.role === 'admin'}
                                                    title={userData.role === 'admin' ? "Cannot delete admin users" : "Delete User"}
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
            </div>
        </div>
    );
};

export default AdminDashboard