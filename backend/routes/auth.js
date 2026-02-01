/**
 * AUTH.JS - Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
    register,
    login,
    guestLogin,
    me,
    logout,
    refresh
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

module.exports = router;
