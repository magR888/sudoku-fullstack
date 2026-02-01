/**
 * TUTORIALSPAGE.JSX - Tutorials List Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tutorialService from '../services/tutorialService';
import '../styles/Tutorials.css';

const TutorialsPage = () => {
    const [tutorials, setTutorials] = useState([]);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const tutorialsData = await tutorialService.getAllTutorials();
            setTutorials(tutorialsData);

            // Try to load progress (may fail if not authenticated)
            try {
                const progressData = await tutorialService.getUserProgress();
                const progressMap = {};
                progressData.forEach(p => {
                    progressMap[p.tutorial_id] = p;
                });
                setProgress(progressMap);
            } catch (err) {
                // User not authenticated, continue without progress
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load tutorials');
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'beginner': '#10B981',
            'intermediate': '#F59E0B',
            'advanced': '#EF4444'
        };
        return colors[difficulty] || '#6B7280';
    };

    if (loading) {
        return <div className="loading-container">Loading tutorials...</div>;
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
        <div className="tutorials-page">
            <div className="tutorials-container">
                <div className="tutorials-header">
                    <h1>📚 Sudoku Tutorials</h1>
                    <p className="tutorials-subtitle">
                        Learn Sudoku step by step, from basics to advanced techniques
                    </p>
                </div>

                <div className="tutorials-grid">
                    {tutorials.map((tutorial) => {
                        const tutorialProgress = progress[tutorial.id];
                        const isCompleted = tutorialProgress?.completed;
                        const percentage = tutorialProgress?.progress_percentage || 0;

                        return (
                            <div 
                                key={tutorial.id}
                                className="tutorial-card"
                                onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                            >
                                <div className="tutorial-icon">{tutorial.icon}</div>
                                
                                <div className="tutorial-content">
                                    <h3 className="tutorial-title">{tutorial.title}</h3>
                                    <p className="tutorial-description">{tutorial.description}</p>
                                    
                                    <div className="tutorial-meta">
                                        <span 
                                            className="tutorial-difficulty"
                                            style={{ color: getDifficultyColor(tutorial.difficulty) }}
                                        >
                                            {tutorial.difficulty}
                                        </span>
                                        <span className="tutorial-duration">
                                            ⏱️ {tutorial.duration_minutes} min
                                        </span>
                                    </div>

                                    {tutorialProgress && (
                                        <div className="tutorial-progress">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="progress-text">
                                                {isCompleted ? '✓ Completed' : `${percentage}% complete`}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isCompleted && (
                                    <div className="completed-badge">✓</div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default TutorialsPage;
