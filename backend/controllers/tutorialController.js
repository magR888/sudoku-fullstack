/**
 * TUTORIALCONTROLLER.JS - Tutorial Management Controller
 */

const db = require('../config/database');

// Get all tutorials
const getAllTutorials = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, slug, description, difficulty, duration_minutes, 
                    icon, order_index
             FROM tutorials
             ORDER BY order_index`
        );

        res.json({ tutorials: result.rows });

    } catch (error) {
        console.error('Get tutorials error:', error);
        res.status(500).json({ error: 'Failed to get tutorials' });
    }
};

// Get tutorial by ID with user progress
const getTutorial = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Get tutorial - check if id is UUID format or slug
        const tutorialResult = await db.query(
            `SELECT id, title, slug, description, difficulty, duration_minutes,
                    icon, content
             FROM tutorials
             WHERE id::text = $1 OR slug = $1`,
            [id]
        );

        if (tutorialResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tutorial not found' });
        }

        const tutorial = tutorialResult.rows[0];

        // Get user progress if authenticated
        let progress = null;
        if (userId) {
            const progressResult = await db.query(
                `SELECT completed, progress_percentage, quiz_score, completed_at
                 FROM user_tutorial_progress
                 WHERE user_id = $1 AND tutorial_id = $2`,
                [userId, tutorial.id]
            );

            if (progressResult.rows.length > 0) {
                progress = progressResult.rows[0];
            }
        }

        res.json({
            tutorial: {
                ...tutorial,
                progress
            }
        });

    } catch (error) {
        console.error('Get tutorial error:', error);
        res.status(500).json({ error: 'Failed to get tutorial' });
    }
};

// Get user's tutorial progress
const getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT tp.tutorial_id, tp.completed, tp.progress_percentage, 
                    tp.quiz_score, tp.completed_at,
                    t.title, t.difficulty, t.duration_minutes, t.icon
             FROM user_tutorial_progress tp
             JOIN tutorials t ON tp.tutorial_id = t.id
             WHERE tp.user_id = $1
             ORDER BY tp.completed_at DESC`,
            [userId]
        );

        res.json({ progress: result.rows });

    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({ error: 'Failed to get progress' });
    }
};

// Update tutorial progress
const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { progressPercentage, completed } = req.body;

        const result = await db.query(
            `INSERT INTO user_tutorial_progress 
                (user_id, tutorial_id, completed, progress_percentage, updated_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id, tutorial_id)
             DO UPDATE SET
                completed = $3,
                progress_percentage = $4,
                updated_at = CURRENT_TIMESTAMP,
                completed_at = CASE WHEN $3 = true AND user_tutorial_progress.completed = false 
                    THEN CURRENT_TIMESTAMP 
                    ELSE user_tutorial_progress.completed_at 
                END
             RETURNING *`,
            [userId, id, completed, progressPercentage]
        );

        res.json({
            message: 'Progress updated',
            progress: result.rows[0]
        });

    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
};

// Submit quiz
const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { answers, score } = req.body;

        // Update progress with quiz score
        await db.query(
            `INSERT INTO user_tutorial_progress 
                (user_id, tutorial_id, quiz_score, completed, progress_percentage, completed_at)
             VALUES ($1, $2, $3, true, 100, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id, tutorial_id)
             DO UPDATE SET
                quiz_score = $3,
                completed = true,
                progress_percentage = 100,
                completed_at = CURRENT_TIMESTAMP`,
            [userId, id, score]
        );

        res.json({
            message: 'Quiz submitted successfully',
            score
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

module.exports = {
    getAllTutorials,
    getTutorial,
    getUserProgress,
    updateProgress,
    submitQuiz
};
