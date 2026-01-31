/**
 * GAMEBOARD.JSX - Main Sudoku Game Board Component
 */

import React, { useState, useEffect } from 'react';
import gameService from '../../services/gameService';
import './Game.css';

const GameBoard = ({ gameId, initialGame }) => {
    const [game, setGame] = useState(initialGame);
    const [selectedCell, setSelectedCell] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Timer
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeElapsed(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Auto-save every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (game && isRunning) {
                saveGame();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [game, timeElapsed, isRunning]);

    const saveGame = async () => {
        try {
            await gameService.updateGame(gameId, {
                currentGrid: game.currentGrid,
                timeElapsed
            });
        } catch (err) {
            console.error('Auto-save failed:', err);
        }
    };

    const handleCellClick = (row, col) => {
        // Check if cell is editable
        if (game.initialGrid[row][col] === 0) {
            setSelectedCell({ row, col });
        }
    };

    const handleNumberInput = async (number) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        
        try {
            const result = await gameService.makeMove(gameId, {
                row,
                col,
                value: number
            });

            // Update grid
            const newGrid = [...game.currentGrid];
            newGrid[row][col] = number;
            setGame({ ...game, currentGrid: newGrid });

            if (!result.isCorrect && number !== 0) {
                setMessage('❌ Incorrect! Try again.');
                setTimeout(() => setMessage(''), 2000);
            } else if (number !== 0) {
                setMessage('✓ Correct!');
                setTimeout(() => setMessage(''), 1000);
            }

            // Check if completed
            checkCompletion(newGrid);

        } catch (err) {
            setError(err.response?.data?.error || 'Move failed');
        }
    };

    const checkCompletion = (grid) => {
        // Check if all cells are filled
        let isFilled = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    isFilled = false;
                    break;
                }
            }
            if (!isFilled) break;
        }

        if (isFilled) {
            completeGame();
        }
    };

    const completeGame = async () => {
        setIsRunning(false);
        
        try {
            const result = await gameService.completeGame(gameId, {
                timeElapsed,
                hintsUsed: game.hintsUsed || 0,
                errorsMade: game.errorsMade || 0
            });

            alert(`🎉 Congratulations!\n\nScore: ${result.score}\nTime: ${formatTime(timeElapsed)}`);
            window.location.href = '/statistics';

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to complete game');
            setIsRunning(true);
        }
    };

    const requestHint = async () => {
        try {
            const hint = await gameService.getHint(gameId, 3);
            
            // Auto-apply hint
            const newGrid = [...game.currentGrid];
            newGrid[hint.row][hint.col] = hint.value;
            setGame({ 
                ...game, 
                currentGrid: newGrid,
                hintsUsed: (game.hintsUsed || 0) + 1
            });

            setSelectedCell({ row: hint.row, col: hint.col });
            setMessage(`💡 Hint: ${hint.value} at row ${hint.row + 1}, col ${hint.col + 1}`);
            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            setError(err.response?.data?.error || 'Hint failed');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderCell = (row, col) => {
        const value = game.currentGrid[row][col];
        const isInitial = game.initialGrid[row][col] !== 0;
        const isSelected = selectedCell?.row === row && selectedCell?.col === col;

        let className = 'cell';
        if (isInitial) className += ' cell-initial';
        if (isSelected) className += ' cell-selected';
        if (col === 2 || col === 5) className += ' box-right-border';
        if (row === 2 || row === 5) className += ' box-bottom-border';

        return (
            <div
                key={`${row}-${col}`}
                className={className}
                onClick={() => handleCellClick(row, col)}
            >
                {value !== 0 ? value : ''}
            </div>
        );
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <h2>Difficulty: {game.difficulty}</h2>
                <div className="game-stats">
                    <div className="stat">
                        <span className="stat-label">Time:</span>
                        <span className="stat-value">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Hints:</span>
                        <span className="stat-value">{game.hintsUsed || 0}</span>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="info-message">{message}</div>}

            <div className="game-board">
                {Array(9).fill(null).map((_, row) => (
                    <React.Fragment key={row}>
                        {Array(9).fill(null).map((_, col) => renderCell(row, col))}
                    </React.Fragment>
                ))}
            </div>

            <div className="number-pad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        className="number-btn"
                        onClick={() => handleNumberInput(num)}
                    >
                        {num}
                    </button>
                ))}
                <button 
                    className="number-btn clear-btn"
                    onClick={() => handleNumberInput(0)}
                >
                    Clear
                </button>
            </div>

            <div className="game-controls">
                <button className="btn btn-secondary" onClick={requestHint}>
                    💡 Hint
                </button>
                <button className="btn btn-secondary" onClick={saveGame}>
                    💾 Save
                </button>
                <button 
                    className="btn btn-warning"
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? '⏸️ Pause' : '▶️ Resume'}
                </button>
            </div>
        </div>
    );
};

export default GameBoard;
