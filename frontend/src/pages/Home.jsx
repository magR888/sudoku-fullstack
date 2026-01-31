/**
 * HOME.JSX - Home/Landing Page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';
import '../styles/Home.css';

const Home = () => {
    const [difficulty, setDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const difficulties = [
        { value: 'very-easy', label: 'Very Easy', color: '#10B981', clues: '51 clues' },
        { value: 'easy', label: 'Easy', color: '#3B82F6', clues: '41 clues' },
        { value: 'medium', label: 'Medium', color: '#F59E0B', clues: '31 clues' },
        { value: 'hard', label: 'Hard', color: '#EF4444', clues: '26 clues' },
        { value: 'expert', label: 'Expert', color: '#8B5CF6', clues: '21 clues' }
    ];

    const handleStartGame = async () => {
        setLoading(true);
        setError('');

        try {
            const game = await gameService.createGame(difficulty);
            navigate(`/game/${game.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">🎓 Sudoku Learning Platform</h1>
                <p className="home-subtitle">
                    Learn, Practice, and Master Sudoku!
                </p>

                <div className="difficulty-selector">
                    <h2>Select Difficulty</h2>
                    <div className="difficulty-grid">
                        {difficulties.map(diff => (
                            <button
                                key={diff.value}
                                className={`difficulty-btn ${difficulty === diff.value ? 'active' : ''}`}
                                style={{
                                    borderColor: difficulty === diff.value ? diff.color : '#E5E7EB',
                                    background: difficulty === diff.value ? diff.color + '20' : 'white'
                                }}
                                onClick={() => setDifficulty(diff.value)}
                            >
                                <span className="difficulty-label">{diff.label}</span>
                                <span className="difficulty-clues">{diff.clues}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    className="btn-start-game"
                    onClick={handleStartGame}
                    disabled={loading}
                >
                    {loading ? 'Creating Game...' : '🎮 Start New Game'}
                </button>

                <div className="home-links">
                    <a href="/statistics" className="home-link">
                        📊 View Statistics
                    </a>
                    <a href="/tutorials" className="home-link">
                        📚 Learn Techniques
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
