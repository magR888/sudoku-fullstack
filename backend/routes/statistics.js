const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const {
    getMyStatistics,
    getAchievements,
    getLeaderboard
} = require('../controllers/statisticsController');

router.get('/me', authMiddleware, getMyStatistics);
router.get('/achievements', authMiddleware, getAchievements);
router.get('/leaderboard', optionalAuth, getLeaderboard);

module.exports = router;
