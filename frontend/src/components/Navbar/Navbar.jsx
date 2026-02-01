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

    if (!isAuthenticated()) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    🎓 Belajar Sudoku
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                    >
                        🏠 Beranda
                    </Link>
                    <Link
                        to="/tutorials"
                        className={`navbar-link ${isActive('/tutorials') ? 'active' : ''}`}
                    >
                        📚 Tutorial
                    </Link>
                    {!isGuest && (
                        <Link
                            to="/learn-techniques"
                            className={`navbar-link ${isActive('/learn-techniques') ? 'active' : ''}`}
                        >
                            🎯 Teknik
                        </Link>
                    )}
                    {!isGuest && (
                        <Link
                            to="/statistics"
                            className={`navbar-link ${isActive('/statistics') ? 'active' : ''}`}
                        >
                            📊 Statistik
                        </Link>
                    )}
                </div>

                <div className="navbar-auth">
                    {!isGuest ? (
                        <Link
                            to="/profile"
                            className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                        >
                            👤 {user?.username}
                        </Link>
                    ) : (
                        <span className="navbar-user">
                            👤 {user?.username}
                        </span>
                    )}
                    <button className="navbar-logout" onClick={logout}>
                        Keluar
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
