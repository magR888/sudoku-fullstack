/**
 * TECHNIQUELEARNINGPAGE.JSX - Page wrapper for Technique Learning
 */

import React from 'react';
import TechniqueLearning from '../components/TechniqueLearning/TechniqueLearning';
import './TechniqueLearningPage.css';

const TechniqueLearningPage = () => {
    return (
        <div className="technique-learning-page">
            <div className="page-header">
                <h1>🎓 Belajar Teknik Sudoku</h1>
                <p className="subtitle">
                    Master teknik-teknik Sudoku dengan tutorial interaktif step-by-step!
                </p>
            </div>

            <TechniqueLearning />
        </div>
    );
};

export default TechniqueLearningPage;
