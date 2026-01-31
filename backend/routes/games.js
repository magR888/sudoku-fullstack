const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    createGame,
    getGame,
    updateGame,
    makeMove,
    getHint,
    completeGame,
    getUserGames
} = require('../controllers/gameController');

// All game routes require authentication
router.post('/', authMiddleware, createGame);
router.get('/user', authMiddleware, getUserGames);
router.get('/:id', authMiddleware, getGame);
router.put('/:id', authMiddleware, updateGame);
router.post('/:id/move', authMiddleware, makeMove);
router.post('/:id/hint', authMiddleware, getHint);
router.post('/:id/complete', authMiddleware, completeGame);

module.exports = router;
