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

        // Compute best times and games by difficulty from actual completed games
        const gamesResult = await db.query(
            `SELECT difficulty, MIN(time_elapsed) as best_time, COUNT(*) as game_count
             FROM games
             WHERE user_id = $1 AND status = 'completed'
             GROUP BY difficulty`,
            [userId]
        );

        const bestTimes = {};
        const gamesByDifficulty = {};
        for (const row of gamesResult.rows) {
            bestTimes[row.difficulty] = row.best_time;
            gamesByDifficulty[row.difficulty] = parseInt(row.game_count);
        }

        // Compute streak from actual completed games
        const daysResult = await db.query(
            `SELECT DISTINCT DATE(completed_at) as play_date
             FROM games
             WHERE user_id = $1 AND status = 'completed' AND completed_at IS NOT NULL
             ORDER BY play_date DESC`,
            [userId]
        );

        let currentStreak = 0;
        let longestStreak = 0;

        if (daysResult.rows.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const firstDate = new Date(daysResult.rows[0].play_date);
            firstDate.setHours(0, 0, 0, 0);

            const diffFromToday = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));

            // Current streak: only count if last play was today or yesterday
            if (diffFromToday <= 1) {
                currentStreak = 1;
                for (let i = 1; i < daysResult.rows.length; i++) {
                    const prevDate = new Date(daysResult.rows[i - 1].play_date);
                    const currDate = new Date(daysResult.rows[i].play_date);
                    prevDate.setHours(0, 0, 0, 0);
                    currDate.setHours(0, 0, 0, 0);
                    const gap = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
                    if (gap === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }

            // Longest streak: scan all dates
            let streak = 1;
            longestStreak = 1;
            for (let i = 1; i < daysResult.rows.length; i++) {
                const prevDate = new Date(daysResult.rows[i - 1].play_date);
                const currDate = new Date(daysResult.rows[i].play_date);
                prevDate.setHours(0, 0, 0, 0);
                currDate.setHours(0, 0, 0, 0);
                const gap = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
                if (gap === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
                if (streak > longestStreak) {
                    longestStreak = streak;
                }
            }
        }

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
                    currentStreak,
                    longestStreak,
                    bestTimes,
                    gamesByDifficulty
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
                currentStreak,
                longestStreak,
                lastPlayDate: stats.last_play_date,
                bestTimes,
                gamesByDifficulty
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
