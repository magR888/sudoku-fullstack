/**
 * TECHNIQUELEARNING.JSX - Interactive Technique Learning Component
 */

import React, { useState } from 'react';
import './TechniqueLearning.css';

const TechniqueLearning = () => {
    const [selectedTechnique, setSelectedTechnique] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCells, setSelectedCells] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);

    const techniques = [
        {
            id: 'naked-single',
            name: 'Naked Single',
            difficulty: 'Beginner',
            icon: '🎯',
            description: 'Teknik paling dasar - menemukan sel yang hanya memiliki 1 kandidat angka',
            steps: [
                {
                    title: 'Pengenalan Naked Single',
                    explanation: 'Naked Single adalah teknik paling fundamental dalam Sudoku. Sebuah sel disebut "Naked Single" jika hanya ada SATU angka yang mungkin di sel tersebut.',
                    grid: [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[0, 2]],
                    instruction: 'Perhatikan sel di Baris 1, Kolom 3 (highlight kuning). Mari kita analisis sel ini!'
                },
                {
                    title: 'Analisis Baris',
                    explanation: 'Langkah pertama: Cek angka apa saja yang sudah ada di BARIS 1',
                    grid: [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[0, 0], [0, 1], [0, 4]],
                    highlightRow: 0,
                    instruction: 'Di Baris 1 sudah ada: 5, 3, 7',
                    usedNumbers: { row: [5, 3, 7] }
                },
                {
                    title: 'Analisis Kolom',
                    explanation: 'Langkah kedua: Cek angka apa saja yang sudah ada di KOLOM 3',
                    grid: [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[2, 2]],
                    highlightCol: 2,
                    instruction: 'Di Kolom 3 sudah ada: 8',
                    usedNumbers: { row: [5, 3, 7], col: [8] }
                },
                {
                    title: 'Analisis Kotak 3×3',
                    explanation: 'Langkah ketiga: Cek angka apa saja yang sudah ada di KOTAK 3×3 (kiri atas)',
                    grid: [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[0, 0], [0, 1], [1, 0], [2, 1], [2, 2]],
                    highlightBox: 0,
                    instruction: 'Di Kotak 3×3 sudah ada: 5, 3, 6, 9, 8',
                    usedNumbers: { row: [5, 3, 7], col: [8], box: [5, 3, 6, 9, 8] }
                },
                {
                    title: 'Eliminasi',
                    explanation: 'Sekarang kita gabungkan semua angka yang sudah terpakai',
                    grid: [
                        [5, 3, 0, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[0, 2]],
                    instruction: 'Angka yang sudah ada: 3, 5, 6, 7, 8, 9. Angka yang masih mungkin: 1, 2, 4',
                    candidates: [1, 2, 4],
                    usedNumbers: { all: [3, 5, 6, 7, 8, 9] }
                },
                {
                    title: 'Naked Single Ditemukan!',
                    explanation: 'Dengan analisis lebih lanjut (cek row/column/box lain), kita temukan hanya angka 4 yang valid!',
                    grid: [
                        [5, 3, 4, 0, 7, 0, 0, 0, 0],
                        [6, 0, 0, 1, 9, 5, 0, 0, 0],
                        [0, 9, 8, 0, 0, 0, 0, 6, 0],
                        [8, 0, 0, 0, 6, 0, 0, 0, 3],
                        [4, 0, 0, 8, 0, 3, 0, 0, 1],
                        [7, 0, 0, 0, 2, 0, 0, 0, 6],
                        [0, 6, 0, 0, 0, 0, 2, 8, 0],
                        [0, 0, 0, 4, 1, 9, 0, 0, 5],
                        [0, 0, 0, 0, 8, 0, 0, 7, 9]
                    ],
                    highlightCells: [[0, 2]],
                    answer: 4,
                    instruction: 'Sel ini adalah NAKED SINGLE dengan nilai 4! ✓',
                    success: true
                }
            ],
            practice: {
                question: 'Coba temukan Naked Single di grid ini!',
                grid: [
                    [0, 0, 3, 0, 2, 0, 6, 0, 0],
                    [9, 0, 0, 3, 0, 5, 0, 0, 1],
                    [0, 0, 1, 8, 0, 6, 4, 0, 0],
                    [0, 0, 8, 1, 0, 2, 9, 0, 0],
                    [7, 0, 0, 0, 0, 0, 0, 0, 8],
                    [0, 0, 6, 7, 0, 8, 2, 0, 0],
                    [0, 0, 2, 6, 0, 9, 5, 0, 0],
                    [8, 0, 0, 2, 0, 3, 0, 0, 9],
                    [0, 0, 5, 0, 1, 0, 3, 0, 0]
                ],
                answerCell: [4, 4],
                answerValue: 5,
                hint: 'Lihat sel di tengah-tengah board (row 5, col 5)!'
            }
        },
        {
            id: 'hidden-single',
            name: 'Hidden Single',
            difficulty: 'Beginner',
            icon: '🔍',
            description: 'Menemukan angka yang hanya bisa di satu tempat dalam row/column/box',
            steps: [
                {
                    title: 'Pengenalan Hidden Single',
                    explanation: 'Hidden Single terjadi ketika sebuah angka hanya bisa ditempatkan di SATU sel dalam row, column, atau box - meskipun sel tersebut punya kandidat lain.',
                    grid: [
                        [0, 0, 0, 2, 6, 0, 7, 0, 1],
                        [6, 8, 0, 0, 7, 0, 0, 9, 0],
                        [1, 9, 0, 0, 0, 4, 5, 0, 0],
                        [8, 2, 0, 1, 0, 0, 0, 4, 0],
                        [0, 0, 4, 6, 0, 2, 9, 0, 0],
                        [0, 5, 0, 0, 0, 3, 0, 2, 8],
                        [0, 0, 9, 3, 0, 0, 0, 7, 4],
                        [0, 4, 0, 0, 5, 0, 0, 3, 6],
                        [7, 0, 3, 0, 1, 8, 0, 0, 0]
                    ],
                    instruction: 'Mari kita cari dimana angka 3 bisa ditempatkan di Row 1'
                },
                {
                    title: 'Scan Row untuk Angka 3',
                    explanation: 'Kita scan Row 1 untuk mencari dimana angka 3 bisa ditempatkan',
                    grid: [
                        [0, 0, 0, 2, 6, 0, 7, 0, 1],
                        [6, 8, 0, 0, 7, 0, 0, 9, 0],
                        [1, 9, 0, 0, 0, 4, 5, 0, 0],
                        [8, 2, 0, 1, 0, 0, 0, 4, 0],
                        [0, 0, 4, 6, 0, 2, 9, 0, 0],
                        [0, 5, 0, 0, 0, 3, 0, 2, 8],
                        [0, 0, 9, 3, 0, 0, 0, 7, 4],
                        [0, 4, 0, 0, 5, 0, 0, 3, 6],
                        [7, 0, 3, 0, 1, 8, 0, 0, 0]
                    ],
                    highlightRow: 0,
                    highlightCells: [[0, 0], [0, 1], [0, 2], [0, 5], [0, 7]],
                    instruction: 'Kandidat untuk angka 3: kolom 1, 2, 3, 6, 8'
                },
                {
                    title: 'Eliminasi dengan Box',
                    explanation: 'Periksa kotak 3×3. Di kotak pertama, kolom 3 sudah punya 3 (row 9). Eliminasi kolom 1, 2, 3!',
                    grid: [
                        [0, 0, 0, 2, 6, 0, 7, 0, 1],
                        [6, 8, 0, 0, 7, 0, 0, 9, 0],
                        [1, 9, 0, 0, 0, 4, 5, 0, 0],
                        [8, 2, 0, 1, 0, 0, 0, 4, 0],
                        [0, 0, 4, 6, 0, 2, 9, 0, 0],
                        [0, 5, 0, 0, 0, 3, 0, 2, 8],
                        [0, 0, 9, 3, 0, 0, 0, 7, 4],
                        [0, 4, 0, 0, 5, 0, 0, 3, 6],
                        [7, 0, 3, 0, 1, 8, 0, 0, 0]
                    ],
                    highlightBox: 0,
                    highlightCells: [[8, 2]],
                    instruction: 'Angka 3 sudah ada di kotak kiri atas (row 9, col 3)'
                },
                {
                    title: 'Hidden Single Ditemukan!',
                    explanation: 'Setelah eliminasi, angka 3 hanya bisa di kolom 6 atau 8. Dengan cek lebih lanjut, ternyata hanya kolom 6 yang valid!',
                    grid: [
                        [0, 0, 0, 2, 6, 3, 7, 0, 1],
                        [6, 8, 0, 0, 7, 0, 0, 9, 0],
                        [1, 9, 0, 0, 0, 4, 5, 0, 0],
                        [8, 2, 0, 1, 0, 0, 0, 4, 0],
                        [0, 0, 4, 6, 0, 2, 9, 0, 0],
                        [0, 5, 0, 0, 0, 3, 0, 2, 8],
                        [0, 0, 9, 3, 0, 0, 0, 7, 4],
                        [0, 4, 0, 0, 5, 0, 0, 3, 6],
                        [7, 0, 3, 0, 1, 8, 0, 0, 0]
                    ],
                    highlightCells: [[0, 5]],
                    answer: 3,
                    instruction: 'Ini adalah HIDDEN SINGLE! Angka 3 "tersembunyi" di kolom 6! ✓',
                    success: true
                }
            ],
            practice: {
                question: 'Temukan Hidden Single untuk angka 5 di row 3!',
                grid: [
                    [0, 0, 3, 0, 2, 0, 6, 0, 0],
                    [9, 0, 0, 3, 0, 5, 0, 0, 1],
                    [0, 0, 1, 8, 0, 6, 4, 0, 0],
                    [0, 0, 8, 1, 0, 2, 9, 0, 0],
                    [7, 0, 0, 0, 0, 0, 0, 0, 8],
                    [0, 0, 6, 7, 0, 8, 2, 0, 0],
                    [0, 0, 2, 6, 0, 9, 5, 0, 0],
                    [8, 0, 0, 2, 0, 3, 0, 0, 9],
                    [0, 0, 5, 0, 1, 0, 3, 0, 0]
                ],
                answerCell: [2, 4],
                answerValue: 5,
                hint: 'Scan row 3 untuk angka 5. Dimana saja 5 bisa ditempatkan?'
            }
        },
        {
            id: 'pointing-pairs',
            name: 'Pointing Pairs',
            difficulty: 'Intermediate',
            icon: '👉',
            description: 'Menggunakan kandidat di box untuk eliminasi di row/column',
            steps: [
                {
                    title: 'Pengenalan Pointing Pairs',
                    explanation: 'Pointing Pairs terjadi ketika kandidat untuk sebuah angka di dalam box hanya ada di satu row atau column. Kita bisa mengeliminasi angka tersebut dari row/column di luar box!',
                    grid: [
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ],
                    instruction: 'Teknik advanced untuk eliminasi kandidat!'
                }
            ],
            practice: null
        }
    ];

    const renderGrid = (grid, highlightCells = [], highlightRow = null, highlightCol = null, highlightBox = null, answer = null) => {
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

    const renderTechniqueList = () => (
        <div className="technique-list">
            <h2>🎓 Pelajari Teknik Sudoku</h2>
            <p className="intro-text">
                Pilih teknik yang ingin Anda pelajari. Setiap teknik dilengkapi dengan:
                penjelasan step-by-step, visualisasi interaktif, dan latihan!
            </p>

            <div className="techniques-grid">
                {techniques.map(technique => (
                    <div 
                        key={technique.id}
                        className="technique-card"
                        onClick={() => {
                            setSelectedTechnique(technique);
                            setCurrentStep(0);
                            setShowAnswer(false);
                        }}
                    >
                        <div className="technique-icon">{technique.icon}</div>
                        <h3>{technique.name}</h3>
                        <span className={`difficulty-badge ${technique.difficulty.toLowerCase()}`}>
                            {technique.difficulty}
                        </span>
                        <p>{technique.description}</p>
                        <button className="learn-btn">Pelajari →</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTechniqueDetail = () => {
        if (!selectedTechnique) return null;

        const step = selectedTechnique.steps[currentStep];

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
                    <span className={`difficulty-badge ${selectedTechnique.difficulty.toLowerCase()}`}>
                        {selectedTechnique.difficulty}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / selectedTechnique.steps.length) * 100}%` }}
                        />
                    </div>
                    <span className="progress-text">
                        Langkah {currentStep + 1} dari {selectedTechnique.steps.length}
                    </span>
                </div>

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

                    {currentStep < selectedTechnique.steps.length - 1 ? (
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
                                // Go to practice
                                if (selectedTechnique.practice) {
                                    setCurrentStep(selectedTechnique.steps.length);
                                }
                            }}
                            disabled={!selectedTechnique.practice}
                        >
                            Latihan →
                        </button>
                    )}
                </div>

                {/* Practice section */}
                {currentStep === selectedTechnique.steps.length && selectedTechnique.practice && (
                    <div className="practice-section">
                        <h3>🎯 Latihan: {selectedTechnique.practice.question}</h3>
                        
                        {renderGrid(selectedTechnique.practice.grid)}

                        <div className="practice-controls">
                            <button 
                                className="hint-btn"
                                onClick={() => alert(selectedTechnique.practice.hint)}
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
                                    Sel di Baris {selectedTechnique.practice.answerCell[0] + 1}, 
                                    Kolom {selectedTechnique.practice.answerCell[1] + 1} = {' '}
                                    <strong className="answer-value">{selectedTechnique.practice.answerValue}</strong>
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
