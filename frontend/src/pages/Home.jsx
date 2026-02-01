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
        { value: 'very-easy', label: 'Sangat Mudah', color: '#10B981', clues: '51 petunjuk' },
        { value: 'easy', label: 'Mudah', color: '#3B82F6', clues: '41 petunjuk' },
        { value: 'medium', label: 'Sedang', color: '#F59E0B', clues: '31 petunjuk' },
        { value: 'hard', label: 'Sulit', color: '#EF4444', clues: '26 petunjuk' },
        { value: 'expert', label: 'Ahli', color: '#8B5CF6', clues: '21 petunjuk' }
    ];

    const handleStartGame = async () => {
        setLoading(true);
        setError('');

        try {
            const game = await gameService.createGame(difficulty);
            navigate(`/game/${game.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal membuat permainan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">🎓 Platform Belajar Sudoku</h1>
                <p className="home-subtitle">
                    Belajar, Berlatih, dan Kuasai Sudoku!
                </p>

                <div className="difficulty-selector">
                    <h2>Pilih Tingkat Kesulitan</h2>
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
                    {loading ? 'Membuat Permainan...' : '🎮 Mulai Permainan Baru'}
                </button>
            </div>
        </div>
    );
};

export default Home;
