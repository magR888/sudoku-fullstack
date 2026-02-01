/**
 * TECHNIQUELEARNING.JSX - Interactive Technique Learning Component
 */

import React, { useState, useEffect } from 'react';
import techniqueService from '../../services/techniqueService';
import './TechniqueLearning.css';

const TechniqueLearning = () => {
    const [techniques, setTechniques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTechnique, setSelectedTechnique] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    // Fetch techniques on mount
    useEffect(() => {
        fetchTechniques();
    }, []);

    const fetchTechniques = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await techniqueService.getAllTechniques();
            setTechniques(data || []);
        } catch (err) {
            console.error('Error fetching techniques:', err);
            setError('Gagal memuat teknik. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleTechniqueSelect = async (technique) => {
        try {
            setLoading(true);
            setError(null);
            const fullTechnique = await techniqueService.getTechnique(technique.slug);
            setSelectedTechnique(fullTechnique);
            setCurrentStep(0);
            setShowAnswer(false);
        } catch (err) {
            console.error('Error fetching technique details:', err);
            setError('Gagal memuat detail teknik. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Map category to display difficulty
    const getCategoryDisplay = (category) => {
        switch (category) {
            case 'basic':
                return 'Beginner';
            case 'intermediate':
                return 'Intermediate';
            case 'advanced':
                return 'Advanced';
            default:
                return category;
        }
    };

    const renderGrid = (grid, highlightCells = [], highlightRow = null, highlightCol = null, highlightBox = null, answer = null) => {
        if (!grid || !Array.isArray(grid)) {
            return <div className="technique-grid">Grid tidak tersedia</div>;
        }
        return (
            <div className="technique-grid">
                {grid.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((cell, colIndex) => {
                            const isHighlighted = highlightCells.some(
                                ([r, c]) => r === rowIndex && c === colIndex
                            );
                            const isRowHighlight = highlightRow === rowIndex;
                            const isColHighlight = highlightCol === colIndex;

                            let isBoxHighlight = false;
                            if (highlightBox !== null) {
                                const boxRow = Math.floor(highlightBox / 3);
                                const boxCol = highlightBox % 3;
                                const inBoxRow = rowIndex >= boxRow * 3 && rowIndex < (boxRow + 1) * 3;
                                const inBoxCol = colIndex >= boxCol * 3 && colIndex < (boxCol + 1) * 3;
                                isBoxHighlight = inBoxRow && inBoxCol;
                            }

                            const isAnswer = answer && cell === answer && isHighlighted;

                            let className = 'technique-cell';
                            if (isHighlighted) className += ' highlighted';
                            if (isRowHighlight) className += ' row-highlight';
                            if (isColHighlight) className += ' col-highlight';
                            if (isBoxHighlight) className += ' box-highlight';
                            if (isAnswer) className += ' answer-cell';
                            if (cell !== 0) className += ' filled';

                            return (
                                <div key={`${rowIndex}-${colIndex}`} className={className}>
                                    {cell !== 0 ? cell : ''}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderLoading = () => (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Memuat...</p>
        </div>
    );

    const renderError = () => (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchTechniques}>
                Coba Lagi
            </button>
        </div>
    );

    const renderTechniqueList = () => (
        <div className="technique-list">
            {loading ? (
                renderLoading()
            ) : error ? (
                renderError()
            ) : (
                <div className="techniques-grid">
                    {techniques.map(technique => (
                        <div
                            key={technique.id}
                            className="technique-card"
                            onClick={() => handleTechniqueSelect(technique)}
                        >
                            <div className="technique-icon">{technique.icon}</div>
                            <h3>{technique.name}</h3>
                            <span className={`difficulty-badge ${getCategoryDisplay(technique.category).toLowerCase()}`}>
                                {getCategoryDisplay(technique.category)}
                            </span>
                            <p>{technique.description}</p>
                            <button className="learn-btn">Pelajari →</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderTechniqueDetail = () => {
        if (!selectedTechnique) return null;

        const steps = selectedTechnique.steps || [];
        const step = steps[currentStep];
        const practice = selectedTechnique.example_puzzle;
        const isPracticeStep = currentStep === steps.length;

        if (loading) {
            return renderLoading();
        }

        return (
            <div className="technique-detail">
                <button
                    className="back-btn"
                    onClick={() => setSelectedTechnique(null)}
                >
                    ← Kembali ke Daftar Teknik
                </button>

                <div className="technique-header">
                    <div className="technique-title">
                        <span className="technique-icon-large">{selectedTechnique.icon}</span>
                        <h2>{selectedTechnique.name}</h2>
                    </div>
                    <span className={`difficulty-badge ${getCategoryDisplay(selectedTechnique.category).toLowerCase()}`}>
                        {getCategoryDisplay(selectedTechnique.category)}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / (steps.length + (practice ? 1 : 0))) * 100}%` }}
                        />
                    </div>
                    <span className="progress-text">
                        {isPracticeStep
                            ? 'Latihan'
                            : `Langkah ${currentStep + 1} dari ${steps.length}`}
                    </span>
                </div>

                {!isPracticeStep && step && (
                    <>
                        {/* Current step */}
                        <div className="step-content">
                            <h3>{step.title}</h3>
                            <p className="step-explanation">{step.explanation}</p>

                            {/* Grid visualization */}
                            {renderGrid(
                                step.grid,
                                step.highlightCells || [],
                                step.highlightRow,
                                step.highlightCol,
                                step.highlightBox,
                                step.answer
                            )}

                            {/* Instruction */}
                            <div className={`instruction-box ${step.success ? 'success' : ''}`}>
                                {step.success && <span className="success-icon">✅</span>}
                                {step.instruction}
                            </div>

                            {/* Used numbers display */}
                            {step.usedNumbers && (
                                <div className="used-numbers">
                                    {step.usedNumbers.row && (
                                        <div className="number-group">
                                            <strong>Baris:</strong> {step.usedNumbers.row.join(', ')}
                                        </div>
                                    )}
                                    {step.usedNumbers.col && (
                                        <div className="number-group">
                                            <strong>Kolom:</strong> {step.usedNumbers.col.join(', ')}
                                        </div>
                                    )}
                                    {step.usedNumbers.box && (
                                        <div className="number-group">
                                            <strong>Kotak:</strong> {step.usedNumbers.box.join(', ')}
                                        </div>
                                    )}
                                    {step.usedNumbers.all && (
                                        <div className="number-group">
                                            <strong>Semua:</strong> {step.usedNumbers.all.join(', ')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Candidates display */}
                            {step.candidates && (
                                <div className="candidates-box">
                                    <strong>Kandidat yang tersisa:</strong> {step.candidates.join(', ')}
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="step-navigation">
                            <button
                                className="nav-btn"
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                            >
                                ← Sebelumnya
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    className="nav-btn primary"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                >
                                    Selanjutnya →
                                </button>
                            ) : (
                                <button
                                    className="nav-btn primary"
                                    onClick={() => {
                                        if (practice) {
                                            setCurrentStep(steps.length);
                                        }
                                    }}
                                    disabled={!practice}
                                >
                                    Latihan →
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Practice section */}
                {isPracticeStep && practice && (
                    <div className="practice-section">
                        <h3>🎯 Latihan: {practice.question}</h3>

                        {renderGrid(practice.grid)}

                        <div className="practice-controls">
                            <button
                                className="hint-btn"
                                onClick={() => alert(practice.hint)}
                            >
                                💡 Petunjuk
                            </button>
                            <button
                                className="answer-btn"
                                onClick={() => setShowAnswer(!showAnswer)}
                            >
                                {showAnswer ? '🙈 Sembunyikan' : '👁️ Lihat Jawaban'}
                            </button>
                        </div>

                        {showAnswer && (
                            <div className="answer-reveal">
                                <h4>✅ Jawaban:</h4>
                                <p>
                                    Sel di Baris {practice.answerCell[0] + 1},
                                    Kolom {practice.answerCell[1] + 1} = {' '}
                                    <strong className="answer-value">{practice.answerValue}</strong>
                                </p>
                            </div>
                        )}

                        <button
                            className="nav-btn"
                            onClick={() => {
                                setCurrentStep(0);
                                setShowAnswer(false);
                            }}
                        >
                            🔄 Ulangi Tutorial
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="technique-learning-container">
            {!selectedTechnique ? renderTechniqueList() : renderTechniqueDetail()}
        </div>
    );
};

export default TechniqueLearning;
