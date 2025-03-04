import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to check if user is authenticated
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false); // Mark authentication check as complete
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);        // Update state
    navigate("/login");               // Redirect to login page
  };

  // Prevent flashing by hiding the navbar while loading
  if (isLoading) {
    return null;  // Don't render anything until authentication check is complete
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <h1>EduTutor</h1>
      </div>
      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <button className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-button" onClick={() => navigate("/signup")}>
              Signup
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </>
        ) : (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Log out
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </>
        )}
        
      </div>
    </nav>
  );
};

export default Navbar;
