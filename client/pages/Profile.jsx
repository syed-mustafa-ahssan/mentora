import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit3, 
  Camera,
  Lock,
  Bell,
  Globe,
  CreditCard,
  LogOut,
  Save,
  X
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Mock user data - replace with actual API data
  const [userData, setUserData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 8+ years of experience. Passionate about React, Node.js, and cloud technologies. Mentor at Mentora since 2021.",
    joinDate: "March 15, 2021",
    lastActive: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
  });

  const [editData, setEditData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Password validation logic would go here
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePassword(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <Lock className="h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'billing', name: 'Billing', icon: <CreditCard className="h-4 w-4" /> }
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-xl p-6">
            {/* Profile Header */}
            <div className="relative">
              <div className="bg-zinc-700 h-24 rounded-lg"></div>
              <div className="relative -mt-12">
                <div className="relative inline-block">
                  <img 
                    src={userData.avatar} 
                    alt={userData.firstName} 
                    className="h-24 w-24 rounded-full border-4 border-zinc-800"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 border-2 border-zinc-800">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-lg font-bold w-full"
                    />
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-lg font-bold w-full"
                    />
                  </div>
                ) : (
                  `${userData.firstName} ${userData.lastName}`
                )}
              </h2>
              <p className="text-zinc-400 text-sm mt-1">Student</p>
              
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="mt-3 bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm w-full h-24 resize-none"
                />
              ) : (
                <p className="mt-3 text-sm text-zinc-300">
                  {userData.bio}
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-700">
              <div className="flex items-center text-sm text-zinc-400 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center text-sm text-zinc-400 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center text-sm text-zinc-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ ...userData });
                    }}
                    className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-800 rounded-xl">
            {/* Tabs */}
            <div className="border-b border-zinc-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                          First Name
                        </label>
                        <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                          {userData.firstName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                          Last Name
                        </label>
                        <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                          {userData.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                          Email Address
                        </label>
                        <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                          {userData.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                          Phone Number
                        </label>
                        <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                          {userData.phone}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                          Location
                        </label>
                        <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                          {userData.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">About</h3>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">
                        Bio
                      </label>
                      <p className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 min-h-[100px]">
                        {userData.bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Password</h3>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Last changed 3 months ago
                          </p>
                        </div>
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                    <div className="space-y-4">
                      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-zinc-400 mt-1">
                              San Francisco, CA • Chrome on Windows
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Active now
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          Signed in: Today at 9:30 AM
                        </p>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Other Session</p>
                            <p className="text-sm text-zinc-400 mt-1">
                              New York, NY • Safari on macOS
                            </p>
                          </div>
                          <button className="text-sm text-red-400 hover:text-red-300">
                            Sign Out
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          Signed in: Dec 12, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-zinc-700">
                        <div>
                          <p className="font-medium">Course Updates</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Notifications about course progress and deadlines
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="course-updates" 
                            className="sr-only" 
                            defaultChecked 
                          />
                          <label 
                            htmlFor="course-updates" 
                            className="block h-6 w-10 rounded-full bg-indigo-600 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-zinc-700">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Messages from instructors and other students
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="messages" 
                            className="sr-only" 
                            defaultChecked 
                          />
                          <label 
                            htmlFor="messages" 
                            className="block h-6 w-10 rounded-full bg-indigo-600 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-zinc-700">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Updates about new courses and platform features
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="newsletter" 
                            className="sr-only" 
                          />
                          <label 
                            htmlFor="newsletter" 
                            className="block h-6 w-10 rounded-full bg-zinc-700 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Promotional Offers</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Special offers and discounts on courses
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="promotions" 
                            className="sr-only" 
                          />
                          <label 
                            htmlFor="promotions" 
                            className="block h-6 w-10 rounded-full bg-zinc-700 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Weekly Summary</p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Get a weekly summary of your learning progress
                          </p>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="weekly-summary" 
                            className="sr-only" 
                            defaultChecked 
                          />
                          <label 
                            htmlFor="weekly-summary" 
                            className="block h-6 w-10 rounded-full bg-indigo-600 cursor-pointer"
                          >
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-indigo-500/20 p-3 rounded-lg">
                            <CreditCard className="h-6 w-6 text-indigo-400" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-zinc-400 mt-1">
                              Expires 12/2025
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-sm">
                            Edit
                          </button>
                          <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Billing History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-zinc-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-700">
                          <tr>
                            <td className="px-4 py-4 text-sm text-zinc-300 whitespace-nowrap">
                              Dec 1, 2023
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              Advanced React Development Course
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              $89.99
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                Paid
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 text-sm text-zinc-300 whitespace-nowrap">
                              Nov 15, 2023
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              UI/UX Design Masterclass
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              $79.99
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                Paid
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 text-sm text-zinc-300 whitespace-nowrap">
                              Oct 5, 2023
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              Data Science Fundamentals
                            </td>
                            <td className="px-4 py-4 text-sm text-zinc-300">
                              $99.99
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                Paid
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-6 flex justify-end">
            <button className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition">
              <LogOut className="h-4 w-4 mr-1" />
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Change Password</h3>
              <button 
                onClick={() => setShowChangePassword(false)}
                className="p-1 rounded-full hover:bg-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;