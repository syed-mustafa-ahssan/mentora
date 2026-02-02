import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { getApiUrl } from "../src/config/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
    bio: "",
    subject: "",
    qualification: "",
    experience_years: "",
    linkedin: "",
    availability: "",
    profile_pic: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      // Prepare the data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        profile_pic: formData.profile_pic || undefined,
        location: formData.location || undefined,
      };

      if (formData.role === "teacher") {
        userData.subject = formData.subject;
        userData.qualification = formData.qualification;
        userData.experience_years = formData.experience_years;
        userData.linkedin = formData.linkedin;
        userData.availability = formData.availability;
      }

      const response = await fetch(getApiUrl("users/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // After successful signup, login the user
      const loginResponse = await fetch(getApiUrl("users/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Login failed after signup");
      }

      // Store the token and user data
      localStorage.setItem("token", loginData.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: loginData.id,
          role: loginData.role, // Store role from login response
        })
      );

      // Login and redirect based on role
      login(loginData.token);

      if (loginData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loginData.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
          <p className="mt-2 text-center text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {formData.role === "teacher" && (
              <>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="What subject do you teach?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Qualification
                  </label>
                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your highest qualification"
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience_years"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Years of Experience
                  </label>
                  <input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    required
                    value={formData.experience_years}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Years of teaching experience"
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    LinkedIn Profile
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your LinkedIn profile URL"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availability"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Availability
                  </label>
                  <input
                    id="availability"
                    name="availability"
                    type="text"
                    required
                    value={formData.availability}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Weekdays 9AM-5PM"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us about yourself"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full pl-10 pr-10 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-zinc-500" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full pl-10 pr-10 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-zinc-500" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="profile_pic"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Profile Picture URL
              </label>
              <input
                id="profile_pic"
                name="profile_pic"
                type="url"
                value={formData.profile_pic}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Link to your profile picture"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your city, country, etc."
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-zinc-600 rounded bg-zinc-700"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-zinc-300">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </button>
            </div>
            <div>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </button>
            </div>
            <div>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;