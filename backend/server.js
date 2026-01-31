/**
 * SERVER.JS - Main Backend Entry Point
 * Sudoku Learning Platform by Kelompok 1
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const tutorialRoutes = require('./routes/tutorials');
const techniqueRoutes = require('./routes/techniques');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sudoku Learning Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/techniques', techniqueRoutes);
app.use('/api/statistics', statisticsRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Test database connection and start server
db.testConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log('=================================');
            console.log('🎓 Sudoku Learning Platform API');
            console.log('=================================');
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`Database: ${process.env.DB_NAME}`);
            console.log('=================================');
        });
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    });

module.exports = app;
