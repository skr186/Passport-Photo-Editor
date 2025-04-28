import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!user);
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate("/login-register");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
          Passport Photo Editor
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Account</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donation">Donation</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Upload">Upload</Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item">
                <Link className="nav-link" onClick={handleLogout} to="/login-register">Logout</Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login-register">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;