/**
 * LOGIN.JSX - Login Component
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, guestLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setError('');
        setGuestLoading(true);

        try {
            await guestLogin();
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setGuestLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">🎓 Sudoku Learning Platform</h1>
                <h2>Login</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="********"
                            minLength="6"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-large"
                        disabled={loading || guestLoading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="or-divider">
                    <span>OR</span>
                </div>

                <button 
                    type="button"
                    className="btn btn-secondary btn-large btn-guest"
                    onClick={handleGuestLogin}
                    disabled={loading || guestLoading}
                >
                    {guestLoading ? 'Creating Guest Account...' : '🎮 Continue as Guest'}
                </button>

                <p className="guest-info">
                    Try the app without registration! Guest progress is temporary.
                </p>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
