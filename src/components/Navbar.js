import React, { useContext  } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();          // Clear user context and localStorage
    navigate("/login"); // Redirect to login page
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <h1>EduTutor</h1>
      </div>
      <div className="navbar-right">
        {!user ? (
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
