// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../component/Navbar";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import AddCourse from "../pages/AddCourse";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import CourseDetail from "../pages/CourseDetail";
import Footer from "../component/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-8">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Redirect authenticated users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-8">Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/add-course" element={
                <ProtectedRoute>
                  <AddCourse />
                </ProtectedRoute>
              } />
              <Route 
                path="/signin" 
                element={
                  <RedirectAuthenticatedUser>
                    <SignIn />
                  </RedirectAuthenticatedUser>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <RedirectAuthenticatedUser>
                    <SignUp />
                  </RedirectAuthenticatedUser>
                } 
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Catch all unmatched routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;