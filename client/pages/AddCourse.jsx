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
        language: "English",
    });
    const [learningOutcomes, setLearningOutcomes] = useState([""]);
    const [prerequisites, setPrerequisites] = useState([""]);
    const [modules, setModules] = useState([{ title: "", lessons: "", duration: "", description: "" }]);
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

    // Handle learning outcomes
    const addLearningOutcome = () => setLearningOutcomes([...learningOutcomes, ""]);
    const removeLearningOutcome = (index) => setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
    const updateLearningOutcome = (index, value) => {
        const updated = [...learningOutcomes];
        updated[index] = value;
        setLearningOutcomes(updated);
    };

    // Handle prerequisites
    const addPrerequisite = () => setPrerequisites([...prerequisites, ""]);
    const removePrerequisite = (index) => setPrerequisites(prerequisites.filter((_, i) => i !== index));
    const updatePrerequisite = (index, value) => {
        const updated = [...prerequisites];
        updated[index] = value;
        setPrerequisites(updated);
    };

    // Handle modules
    const addModule = () => setModules([...modules, { title: "", lessons: "", duration: "", description: "" }]);
    const removeModule = (index) => setModules(modules.filter((_, i) => i !== index));
    const updateModule = (index, field, value) => {
        const updated = [...modules];
        updated[index][field] = value;
        setModules(updated);
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
            duration: formData.duration || null,
            learningOutcomes: learningOutcomes.filter(o => o.trim() !== ""),
            prerequisites: prerequisites.filter(p => p.trim() !== ""),
            modules: modules
                .filter(m => m.title.trim() !== "")
                .map(m => ({
                    title: m.title,
                    lessons: parseInt(m.lessons) || 0,
                    duration: m.duration || "0h",
                    description: m.description || ""
                })),
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
                language: "English",
            });
            setLearningOutcomes([""]);
            setPrerequisites([""]);
            setModules([{ title: "", lessons: "", duration: "", description: "" }]);
            // Navigate back to dashboard after a delay
            setTimeout(() => navigate('/dashboard'), 2000);
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

                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-zinc-300 mb-1">
                        Language
                    </label>
                    <input
                        type="text"
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        placeholder="English"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Learning Outcomes */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Learning Outcomes (What students will learn)
                    </label>
                    {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-center mb-2 space-x-2">
                            <input
                                type="text"
                                value={outcome}
                                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                                placeholder={`Outcome ${index + 1}`}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {learningOutcomes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLearningOutcome(index)}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLearningOutcome}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                    >
                        + Add Learning Outcome
                    </button>
                </div>

                {/* Prerequisites */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Prerequisites (Optional)
                    </label>
                    {prerequisites.map((prereq, index) => (
                        <div key={index} className="flex items-center mb-2 space-x-2">
                            <input
                                type="text"
                                value={prereq}
                                onChange={(e) => updatePrerequisite(index, e.target.value)}
                                placeholder={`Prerequisite ${index + 1}`}
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {prerequisites.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePrerequisite(index)}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPrerequisite}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                    >
                        + Add Prerequisite
                    </button>
                </div>

                {/* Modules */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Course Modules (Curriculum)
                    </label>
                    {modules.map((module, index) => (
                        <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-3">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-zinc-200">Module {index + 1}</h4>
                                {modules.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeModule(index)}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                    >
                                        Remove Module
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => updateModule(index, 'title', e.target.value)}
                                    placeholder="Module title"
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        value={module.lessons}
                                        onChange={(e) => updateModule(index, 'lessons', e.target.value)}
                                        placeholder="Number of lessons"
                                        min="0"
                                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        value={module.duration}
                                        onChange={(e) => updateModule(index, 'duration', e.target.value)}
                                        placeholder="Duration (e.g., 2h 30m)"
                                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <textarea
                                    value={module.description}
                                    onChange={(e) => updateModule(index, 'description', e.target.value)}
                                    placeholder="Module description (optional)"
                                    rows="2"
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                ></textarea>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addModule}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                    >
                        + Add Module
                    </button>
                </div>

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