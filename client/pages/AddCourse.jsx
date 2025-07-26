import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiPost } from "../src/utils/api";
import { useAuth } from "../src/contexts/AuthContext";

const AddCourse = () => {
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        description: "",
        material_url: "",
        access_type: "free", // Default to free
        price: "",
        thumbnail: "",
        level: "beginner", // Default to beginner
        duration: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { user, token } = useAuth(); // Destructure token from useAuth
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Basic validation
        if (!user?.id) {
            setError("Teacher ID is required. Please sign in.");
            setLoading(false);
            return;
        }
        if (!formData.title) {
            setError("Title is required.");
            setLoading(false);
            return;
        }

        // Prepare data for API call
        const courseData = {
            ...formData,
            teacher_id: user.id, // Use teacher_id from auth context
            price: formData.access_type === 'paid' ? parseFloat(formData.price) || null : null,
            duration: formData.duration ? parseFloat(formData.duration) || null : null,
        };

        try {
            const response = await apiPost(
                "http://localhost:5000/api/users/course-upload",
                courseData,
                token // Pass the token from useAuth
            );
            console.log(response)

            setSuccess("Course created successfully!");
            // Reset form
            setFormData({
                title: "",
                subject: "",
                description: "",
                material_url: "",
                access_type: "free",
                price: "",
                thumbnail: "",
                level: "beginner",
                duration: "",
            });
            // Navigate back to courses page after a delay
            setTimeout(() => navigate('/courses'), 2000);
        } catch (err) {
            console.error("API Error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to create course. Please check your network or try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Add New Course</h1>

            {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                        Course Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="material_url" className="block text-sm font-medium text-zinc-300 mb-1">
                        Material URL
                    </label>
                    <input
                        type="url"
                        id="material_url"
                        name="material_url"
                        value={formData.material_url}
                        onChange={handleChange}
                        placeholder="https://example.com/material"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-zinc-300 mb-1">
                        Thumbnail URL
                    </label>
                    <input
                        type="url"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="https://example.com/thumbnail.jpg"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="level" className="block text-sm font-medium text-zinc-300 mb-1">
                        Level
                    </label>
                    <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-zinc-300 mb-1">
                        Duration (hours)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="0"
                        step="0.1"
                        placeholder="e.g., 10.5"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="access_type" className="block text-sm font-medium text-zinc-300 mb-1">
                        Access Type
                    </label>
                    <select
                        id="access_type"
                        name="access_type"
                        value={formData.access_type}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                {formData.access_type === 'paid' && (
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/courses')}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;