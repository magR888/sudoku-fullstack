const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const {
    getAllTutorials,
    getTutorial,
    getUserProgress,
    updateProgress,
    submitQuiz
} = require('../controllers/tutorialController');

// Public routes
router.get('/', optionalAuth, getAllTutorials);
router.get('/:id', optionalAuth, getTutorial);

// Protected routes
router.get('/progress/me', authMiddleware, getUserProgress);
router.post('/:id/progress', authMiddleware, updateProgress);
router.post('/:id/quiz', authMiddleware, submitQuiz);

module.exports = router;
