/**
 * TUTORIALDETAILPAGE.JSX - Tutorial Content Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tutorialService from '../services/tutorialService';
import '../styles/Tutorials.css';

const TutorialDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        loadTutorial();
    }, [id]);

    const loadTutorial = async () => {
        try {
            const data = await tutorialService.getTutorial(id);
            setTutorial(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memuat tutorial');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            await tutorialService.updateProgress(tutorial.id, {
                completed: true,
                progressPercentage: 100
            });
            alert('Tutorial selesai! 🎉');
            navigate('/tutorials');
        } catch (err) {
            console.error('Failed to mark complete:', err);
        }
    };

    const handleNext = () => {
        if (currentSection < tutorial.content.sections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    if (loading) {
        return <div className="loading-container">Memuat tutorial...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Kesalahan</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/tutorials')}>Kembali ke Tutorial</button>
            </div>
        );
    }

    const section = tutorial.content.sections[currentSection];
    const isLastSection = currentSection === tutorial.content.sections.length - 1;

    return (
        <div className="tutorial-detail-page">
            <div className="tutorial-detail-container">
                {/* Header */}
                <div className="tutorial-detail-header">
                    <button 
                        className="btn-back"
                        onClick={() => navigate('/tutorials')}
                    >
                        ← Kembali ke Tutorial
                    </button>
                    <h1>{tutorial.title}</h1>
                    <div className="tutorial-meta">
                        <span className="meta-item">
                            📊 {tutorial.difficulty}
                        </span>
                        <span className="meta-item">
                            ⏱️ {tutorial.duration_minutes} menit
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="tutorial-progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ 
                            width: `${((currentSection + 1) / tutorial.content.sections.length) * 100}%` 
                        }}
                    />
                </div>

                {/* Content */}
                <div className="tutorial-content-area">
                    <h2 className="section-title">
                        {section.title}
                    </h2>
                    
                    <div className="section-content">
                        {section.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    {section.example && (
                        <div className="section-example">
                            <h3>📝 Contoh:</h3>
                            <div className="example-content">
                                {section.example}
                            </div>
                        </div>
                    )}

                    {section.tips && section.tips.length > 0 && (
                        <div className="section-tips">
                            <h3>💡 Kiat:</h3>
                            <ul>
                                {section.tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="tutorial-navigation">
                    <button 
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                        disabled={currentSection === 0}
                    >
                        ← Sebelumnya
                    </button>

                    <span className="section-indicator">
                        {currentSection + 1} / {tutorial.content.sections.length}
                    </span>

                    {!isLastSection ? (
                        <button 
                            className="btn btn-primary"
                            onClick={handleNext}
                        >
                            Selanjutnya →
                        </button>
                    ) : (
                        <button 
                            className="btn btn-success"
                            onClick={handleComplete}
                        >
                            Selesaikan Tutorial ✓
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialDetailPage;
