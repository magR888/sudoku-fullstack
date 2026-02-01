/**
 * NAVBAR.JSX - Global Navigation Bar
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();

    const isActive = (path) => location.pathname === path;
    const isGuest = user?.is_guest;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    🎓 Sudoku Learning
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/tutorials"
                        className={`navbar-link ${isActive('/tutorials') ? 'active' : ''}`}
                    >
                        📚 Tutorials
                    </Link>
                    {!isGuest && (
                        <Link
                            to="/learn-techniques"
                            className={`navbar-link ${isActive('/learn-techniques') ? 'active' : ''}`}
                        >
                            🎯 Techniques
                        </Link>
                    )}
                    {isAuthenticated() && !isGuest && (
                        <Link
                            to="/statistics"
                            className={`navbar-link ${isActive('/statistics') ? 'active' : ''}`}
                        >
                            📊 Statistics
                        </Link>
                    )}
                </div>

                <div className="navbar-auth">
                    {isAuthenticated() ? (
                        <>
                            <span className="navbar-user">
                                👤 {user?.username}
                            </span>
                            <button className="navbar-logout" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/register" className="navbar-btn">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
