// components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  User,
  BarChart2,
  Home,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../src/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Courses", path: "/courses", icon: <BookOpen size={20} /> },
  ];

  // Add protected routes only when authenticated
  if (isAuthenticated) {
    navItems.push(
      { name: "Dashboard", path: "/dashboard", icon: <BarChart2 size={20} /> },
      { name: "Profile", path: "/profile", icon: <User size={20} /> }
    );
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold">Mentora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${isActive(item.path)
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              {/* Auth Buttons */}
              <div className="ml-4 flex items-center">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="ml-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${isActive(item.path)
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-3 border-t border-zinc-700">
              {isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
