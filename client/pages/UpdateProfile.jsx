// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext'; // Adjust path if necessary
import { apiFetch } from '../src/utils/api'; // Adjust path if necessary
import { User, Mail, Phone, MapPin, FileText, Link as LinkIcon, Calendar, Save, X } from 'lucide-react'; // Import icons

const UpdateProfile = () => {
    const { user, updateUser } = useAuth(); // Assuming updateUser updates the context
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profile_pic: '', // This might need specific handling (e.g., file upload or URL)
        bio: '',
        // Teacher-specific fields - conditionally rendered
        subject: '',
        qualification: '',
        experience_years: '',
        linkedin: '',
        availability: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            // Populate form with existing user data when component mounts and user data is available
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profile_pic: user.profile_pic || '', // Handle image URL if stored
                bio: user.bio || '',
                subject: user.subject || '',
                qualification: user.qualification || '',
                experience_years: user.experience_years || '',
                linkedin: user.linkedin || '',
                availability: user.availability || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Send PUT request to update profile
            const response = await apiFetch(`http://localhost:5000/api/users/update-profile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization header should ideally be handled by apiFetch if using tokens
                },
                body: JSON.stringify(formData),
            });

            // Check if response is already parsed (e.g., apiFetch returns JSON directly)
            let data;
            if (typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response; // Assume apiFetch already parsed the response
            }

            if (response.ok || response.status === 200) {
                // Update successful
                setSuccess('Profile updated successfully!');
                // Update the user context with new data
                updateUser({ ...user, ...formData }); // Merge updated data
                // Navigate back to profile after a delay
                setTimeout(() => navigate('/sign'), 2000);
            } else {
                // Handle server errors
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            console.error("Update Profile Error:", err);
            if (err.name === 'HTTPError') { // If your apiFetch throws specific errors
                setError(`Server Error: ${err.message}`);
            } else if (err.name === 'NetworkError') {
                setError("Network Error: Unable to reach the server.");
            } else {
                setError(`An unexpected error occurred: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    }; 

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="bg-zinc-800 p-6 rounded-xl inline-block">
                        <User className="h-12 w-12 text-indigo-500 mx-auto" />
                        <h3 className="mt-4 text-xl font-medium">Please sign in to update your profile</h3>
                        {/* Add a link to sign in if needed */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                    <p className="mt-2 text-zinc-400">
                        Update your personal information
                    </p>
                </div>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition duration-300"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </button>
            </div>

            <div className="bg-zinc-800 rounded-xl p-6">
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-zinc-300 mb-1">Bio</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3">
                                <FileText className="h-4 w-4 text-zinc-500" />
                            </div>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                    </div>

                    {/* Profile Picture URL (Simplified) */}
                    {/* Note: Real image upload requires handling file input and backend logic */}
                    <div>
                        <label htmlFor="profile_pic" className="block text-sm font-medium text-zinc-300 mb-1">Profile Picture URL</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-zinc-500" /> {/* Or an image icon if preferred */}
                            </div>
                            <input
                                type="text" // Change to 'file' for direct upload, but needs backend handling
                                id="profile_pic"
                                name="profile_pic"
                                value={formData.profile_pic}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                                className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Teacher-Specific Section */}
                    {user.role === 'teacher' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Instructor Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="qualification" className="block text-sm font-medium text-zinc-300 mb-1">Qualification</label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="experience_years" className="block text-sm font-medium text-zinc-300 mb-1">Years of Experience</label>
                                    <input
                                        type="number"
                                        id="experience_years"
                                        name="experience_years"
                                        value={formData.experience_years}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-zinc-300 mb-1">LinkedIn Profile</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LinkIcon className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <input
                                            type="url"
                                            id="linkedin"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            placeholder="https://linkedin.com/in/..."
                                            className="pl-10 w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="availability" className="block text-sm font-medium text-zinc-300 mb-1">Availability</label>
                                    <textarea
                                        id="availability"
                                        name="availability"
                                        rows={2}
                                        value={formData.availability}
                                        onChange={handleChange}
                                        placeholder="e.g., Weekdays 9am-5pm, Flexible weekends"
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-6 py-2 rounded-lg font-medium transition duration-300 ${loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;