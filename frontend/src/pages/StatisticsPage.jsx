/**
 * STATISTICSPAGE.JSX - Complete Statistics Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import statsService from '../services/statsService';
import '../styles/Statistics.css';

const StatisticsPage = () => {
    const [statistics, setStatistics] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [leaderboardType, setLeaderboardType] = useState('score');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [stats, achievs, leaders] = await Promise.all([
                statsService.getMyStatistics(),
                statsService.getAchievements(),
                statsService.getLeaderboard('score', 'all', 10)
            ]);

            setStatistics(stats);
            setAchievements(achievs);
            setLeaderboard(leaders);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const loadLeaderboard = async (type) => {
        try {
            const leaders = await statsService.getLeaderboard(type, 'all', 10);
            setLeaderboard(leaders);
            setLeaderboardType(type);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m ${secs}s`;
    };

    if (loading) {
        return <div className="loading-container">Loading statistics...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            <div className="statistics-container">
                <div className="stats-header">
                    <h1>📊 Your Statistics</h1>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/')}
                    >
                        🎮 New Game
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon">🎮</div>
                        <div className="stat-info">
                            <div className="stat-label">Total Games</div>
                            <div className="stat-value">{statistics.totalGames}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-info">
                            <div className="stat-label">Win Rate</div>
                            <div className="stat-value">{statistics.winRate}%</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-info">
                            <div className="stat-label">Avg Time</div>
                            <div className="stat-value">{formatTime(statistics.avgTime)}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-info">
                            <div className="stat-label">Current Streak</div>
                            <div className="stat-value">{statistics.currentStreak}</div>
                            <div className="stat-sublabel">Best: {statistics.longestStreak}</div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="stats-section">
                    <h2>🏅 Achievements</h2>
                    <div className="achievements-grid">
                        {achievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="achievement-icon">
                                    {achievement.unlocked ? achievement.icon : '🔒'}
                                </div>
                                <div className="achievement-info">
                                    <div className="achievement-name">{achievement.name}</div>
                                    <div className="achievement-desc">{achievement.description}</div>
                                    {achievement.unlocked && achievement.unlockedAt && (
                                        <div className="achievement-date">
                                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Times */}
                <div className="stats-section">
                    <h2>⚡ Best Times by Difficulty</h2>
                    <div className="best-times">
                        {['very-easy', 'easy', 'medium', 'hard', 'expert'].map(diff => {
                            const time = statistics.bestTimes?.[diff];
                            const games = statistics.gamesByDifficulty?.[diff] || 0;
                            return (
                                <div key={diff} className="time-row">
                                    <div className="difficulty-badge" data-difficulty={diff}>
                                        {diff.replace('-', ' ')}
                                    </div>
                                    <div className="time-value">
                                        {time ? formatTime(time) : 'Not played'}
                                    </div>
                                    <div className="games-count">
                                        {games} games
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="stats-section">
                    <h2>👑 Leaderboard</h2>
                    <div className="leaderboard-tabs">
                        <button 
                            className={`tab ${leaderboardType === 'score' ? 'active' : ''}`}
                            onClick={() => loadLeaderboard('score')}
                        >
                            Score
                        </button>
                        <button 
                            className={`tab ${leaderboardType === 'speed' ? 'active' : ''}`}
                            onClick={() => loadLeaderboard('speed')}
                        >
                            Speed
                        </button>
                    </div>
                    <div className="leaderboard-table">
                        {leaderboard.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Player</th>
                                        <th>{leaderboardType === 'score' ? 'Score' : 'Time'}</th>
                                        <th>Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={entry.userId}>
                                            <td className="rank">
                                                {index === 0 && '🥇'}
                                                {index === 1 && '🥈'}
                                                {index === 2 && '🥉'}
                                                {index > 2 && `#${entry.rank}`}
                                            </td>
                                            <td className="username">{entry.username}</td>
                                            <td className="value">
                                                {leaderboardType === 'score' 
                                                    ? entry.score 
                                                    : formatTime(entry.time)}
                                            </td>
                                            <td>
                                                <span 
                                                    className="difficulty-badge small" 
                                                    data-difficulty={entry.difficulty}
                                                >
                                                    {entry.difficulty}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                No leaderboard entries yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
