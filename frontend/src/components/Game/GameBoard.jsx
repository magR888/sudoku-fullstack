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
    const [hintExplanation, setHintExplanation] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

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
                setMessage('❌ Salah! Coba lagi.');
                setTimeout(() => setMessage(''), 2000);
            } else if (number !== 0) {
                setMessage('✓ Benar!');
                setTimeout(() => setMessage(''), 1000);
            }

            // Check if completed
            checkCompletion(newGrid);

        } catch (err) {
            setError(err.response?.data?.error || 'Langkah gagal');
            setTimeout(() => setError(''), 2000);
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

            alert(`🎉 Selamat!\n\nSkor: ${result.score}\nWaktu: ${formatTime(timeElapsed)}`);
            window.location.href = '/statistics';

        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menyelesaikan permainan');
            setIsRunning(true);
        }
    };

    const requestHint = async () => {
        try {
            const hint = await gameService.getHint(gameId, 3);
            
            // Store explanation
            setHintExplanation(hint.explanation);
            setShowExplanation(true);
            
            // Auto-apply hint
            const newGrid = [...game.currentGrid];
            newGrid[hint.row][hint.col] = hint.value;
            setGame({ 
                ...game, 
                currentGrid: newGrid,
                hintsUsed: (game.hintsUsed || 0) + 1
            });

            setSelectedCell({ row: hint.row, col: hint.col });
            setMessage(`💡 Petunjuk diterapkan! Lihat penjelasan di bawah.`);
            setTimeout(() => setMessage(''), 5000);

        } catch (err) {
            setError(err.response?.data?.error || 'Petunjuk gagal');
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
            {/* Pause Modal */}
            {!isRunning && (
                <div className="pause-overlay">
                    <div className="pause-modal">
                        <div className="pause-icon">⏸️</div>
                        <h3>Permainan Dijeda</h3>
                        <p>Istirahat sejenak! Progres Anda tersimpan.</p>
                        <button
                            className="btn btn-primary btn-large"
                            onClick={() => setIsRunning(true)}
                        >
                            ▶️ Lanjutkan Permainan
                        </button>
                    </div>
                </div>
            )}

            <div className="game-header">
                <h2>Kesulitan: {game.difficulty}</h2>
                <div className="game-stats">
                    <div className="stat">
                        <span className="stat-label">Waktu:</span>
                        <span className="stat-value">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Petunjuk:</span>
                        <span className="stat-value">{game.hintsUsed || 0}</span>
                    </div>
                </div>
            </div>

            {error && <div className="game-toast error">{error}</div>}
            {message && (
                <div className={`game-toast ${message.includes('❌') ? 'error' : message.includes('✓') ? 'success' : 'info'}`}>
                    {message}
                </div>
            )}

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
                    ✕
                </button>
            </div>

            <div className="game-controls">
                <button className="btn btn-secondary" onClick={requestHint}>
                    💡 Petunjuk
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setIsRunning(!isRunning)}
                >
                    {isRunning ? '⏸️ Jeda' : '▶️ Lanjutkan'}
                </button>
            </div>

            {/* Hint Explanation Panel */}
            {showExplanation && hintExplanation && (
                <div className="hint-explanation-panel">
                    <div className="explanation-header">
                        <h3>💡 {hintExplanation.title}</h3>
                        <button 
                            className="close-btn"
                            onClick={() => setShowExplanation(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="explanation-content">
                        <div className="explanation-value">
                            <span className="label">Angka yang dipilih:</span>
                            <span className="value-big">{hintExplanation.value}</span>
                        </div>

                        <div className="explanation-steps">
                            <h4>📋 Langkah Analisis:</h4>
                            {hintExplanation.steps.map((step, index) => (
                                <div 
                                    key={index} 
                                    className={`step ${step.highlight ? 'highlight' : ''}`}
                                >
                                    <div className="step-number">{index + 1}</div>
                                    <div 
                                        className="step-description"
                                        dangerouslySetInnerHTML={{ __html: step.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="explanation-conclusion">
                            <h4>✅ Kesimpulan:</h4>
                            <p dangerouslySetInnerHTML={{ __html: hintExplanation.conclusion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>

                        <div className="explanation-technique">
                            <span className="technique-badge">{hintExplanation.technique}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameBoard;
