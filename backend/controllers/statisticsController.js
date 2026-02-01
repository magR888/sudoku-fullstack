/**
 * STATISTICSCONTROLLER.JS - Statistics & Leaderboard Controller
 */

const db = require('../config/database');

// Get user statistics
const getMyStatistics = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT total_games, games_won, total_time, total_hints, total_errors,
                    current_streak, longest_streak, last_play_date, best_times, games_by_difficulty
             FROM user_statistics
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            // Create initial statistics
            await db.query(
                'INSERT INTO user_statistics (user_id) VALUES ($1)',
                [userId]
            );
            return res.json({
                statistics: {
                    totalGames: 0,
                    gamesWon: 0,
                    totalTime: 0,
                    totalHints: 0,
                    totalErrors: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    bestTimes: {},
                    gamesByDifficulty: {}
                }
            });
        }

        const stats = result.rows[0];
        
        res.json({
            statistics: {
                totalGames: stats.total_games,
                gamesWon: stats.games_won,
                winRate: stats.total_games > 0 ? 
                    Math.round((stats.games_won / stats.total_games) * 100) : 0,
                totalTime: stats.total_time,
                avgTime: stats.total_games > 0 ? 
                    Math.floor(stats.total_time / stats.total_games) : 0,
                totalHints: stats.total_hints,
                totalErrors: stats.total_errors,
                currentStreak: stats.current_streak,
                longestStreak: stats.longest_streak,
                lastPlayDate: stats.last_play_date,
                bestTimes: stats.best_times,
                gamesByDifficulty: stats.games_by_difficulty
            }
        });

    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ error: 'Gagal memuat statistik' });
    }
};

// Get achievements
const getAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all achievements
        const allResult = await db.query(
            'SELECT id, name, slug, description, icon, type, requirement FROM achievements ORDER BY requirement'
        );

        // Get user's unlocked achievements
        const unlockedResult = await db.query(
            'SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = $1',
            [userId]
        );

        const unlocked = new Set(unlockedResult.rows.map(r => r.achievement_id));

        const achievements = allResult.rows.map(ach => ({
            id: ach.id,
            name: ach.name,
            slug: ach.slug,
            description: ach.description,
            icon: ach.icon,
            type: ach.type,
            requirement: ach.requirement,
            unlocked: unlocked.has(ach.id),
            unlockedAt: unlockedResult.rows.find(r => r.achievement_id === ach.id)?.unlocked_at
        }));

        res.json({ achievements });

    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Gagal memuat pencapaian' });
    }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const { type = 'score', difficulty = 'all', limit = 10 } = req.query;

        let query = `
            SELECT l.id, l.user_id, u.username, l.score, l.time, l.difficulty, l.created_at
            FROM leaderboard l
            JOIN users u ON l.user_id = u.id
        `;

        const params = [];
        const conditions = [];

        if (difficulty !== 'all') {
            conditions.push(`l.difficulty = $${params.length + 1}`);
            params.push(difficulty);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (type === 'score') {
            query += ' ORDER BY l.score DESC';
        } else if (type === 'speed') {
            query += ' ORDER BY l.time ASC';
        } else {
            query += ' ORDER BY l.created_at DESC';
        }

        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await db.query(query, params);

        const leaderboard = result.rows.map((row, index) => ({
            rank: index + 1,
            userId: row.user_id,
            username: row.username,
            score: row.score,
            time: row.time,
            difficulty: row.difficulty,
            createdAt: row.created_at
        }));

        res.json({ leaderboard });

    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Gagal memuat papan peringkat' });
    }
};

module.exports = {
    getMyStatistics,
    getAchievements,
    getLeaderboard
};
