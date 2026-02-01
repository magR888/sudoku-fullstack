/**
 * GAMEPAGE.JSX - Game Page Wrapper
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameBoard from '../components/Game/GameBoard';
import gameService from '../services/gameService';
import '../components/Game/Game.css';

const GamePage = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadGame();
    }, [id]);

    const loadGame = async () => {
        try {
            const gameData = await gameService.getGame(id);
            setGame(gameData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load game');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="game-page">
                <div className="loading-container">
                    <h2>Loading game...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-page">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <a href="/">Back to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="game-page">
            <GameBoard gameId={id} initialGame={game} />
        </div>
    );
};

export default GamePage;
