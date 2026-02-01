const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const {
    getAllTechniques,
    getTechnique,
    getUserMastery,
    recordPractice
} = require('../controllers/techniqueController');

// Get all techniques (optionally includes user mastery)
router.get('/', optionalAuth, getAllTechniques);

// Get user's technique mastery (BEFORE /:id to avoid route conflict)
router.get('/mastery/me', authMiddleware, getUserMastery);

// Get technique by ID or slug
router.get('/:id', optionalAuth, getTechnique);

// Record practice session
router.post('/:id/practice', authMiddleware, recordPractice);

module.exports = router;
