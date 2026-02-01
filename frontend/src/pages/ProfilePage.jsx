/**
 * PROFILEPAGE.JSX - User Profile Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await authService.getCurrentUser();
            setProfile(user);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memuat profil');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading-container">Memuat profil...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Kesalahan</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Kembali ke Beranda</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} />
                        ) : (
                            <div className="avatar-placeholder">
                                {(profile.full_name || profile.username || '?').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h1>{profile.full_name || profile.username}</h1>
                    <p className="profile-username">@{profile.username}</p>
                    {profile.email && (
                        <p className="profile-email">{profile.email}</p>
                    )}
                </div>

                <div className="profile-info-cards">
                    <div className="profile-info-card">
                        <div className="info-icon">📅</div>
                        <div className="info-detail">
                            <div className="info-label">Bergabung Sejak</div>
                            <div className="info-value">{formatDate(profile.created_at)}</div>
                        </div>
                    </div>
                    <div className="profile-info-card">
                        <div className="info-icon">🕐</div>
                        <div className="info-detail">
                            <div className="info-label">Login Terakhir</div>
                            <div className="info-value">{formatDate(profile.last_login)}</div>
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <h2>Statistik Permainan</h2>
                    <div className="profile-stats-grid">
                        <div className="profile-stat-card">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.total_games || 0}</div>
                                <div className="stat-label">Total Permainan</div>
                            </div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.games_won || 0}</div>
                                <div className="stat-label">Permainan Dimenangkan</div>
                            </div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.current_streak || 0}</div>
                                <div className="stat-label">Streak Saat Ini</div>
                            </div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="stat-icon">🏅</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.achievements_count || 0}</div>
                                <div className="stat-label">Pencapaian</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
