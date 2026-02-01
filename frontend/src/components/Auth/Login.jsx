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
                <h1 className="auth-title">🎓 Platform Belajar Sudoku</h1>
                <h2>Masuk</h2>

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
                            placeholder="email@anda.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Kata Sandi</label>
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
                        {loading ? 'Sedang masuk...' : 'Masuk'}
                    </button>
                </form>

                <div className="or-divider">
                    <span>ATAU</span>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary btn-large btn-guest"
                    onClick={handleGuestLogin}
                    disabled={loading || guestLoading}
                >
                    {guestLoading ? 'Membuat Akun Tamu...' : '🎮 Lanjutkan sebagai Tamu'}
                </button>

                <p className="guest-info">
                    Coba aplikasi tanpa registrasi! Progres tamu bersifat sementara.
                </p>

                <p className="auth-link">
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
