/**
 * GAMECONTROLLER.JS - Game Management Controller
 */

const db = require('../config/database');
const SudokuGenerator = require('../utils/sudokuGenerator');
const ScoreCalculator = require('../utils/scoreCalculator');

const generator = new SudokuGenerator();
const calculator = new ScoreCalculator();

// Create new game
const createGame = async (req, res) => {
    try {
        const { difficulty = 'medium' } = req.body;
        const userId = req.user.id;

        // Validate difficulty
        const validDifficulties = ['very-easy', 'easy', 'medium', 'hard', 'expert'];
        if (!validDifficulties.includes(difficulty)) {
            return res.status(400).json({ error: 'Invalid difficulty level' });
        }

        // Generate puzzle
        const { puzzle, solution } = generator.generatePuzzle(difficulty);

        // Save to database
        const result = await db.query(
            `INSERT INTO games (user_id, difficulty, initial_grid, solution_grid, current_grid, status)
             VALUES ($1, $2, $3, $4, $5, 'in_progress')
             RETURNING id, difficulty, initial_grid, current_grid, status, created_at`,
            [userId, difficulty, JSON.stringify(puzzle), JSON.stringify(solution), JSON.stringify(puzzle)]
        );

        const game = result.rows[0];

        res.status(201).json({
            message: 'Game created successfully',
            game: {
                id: game.id,
                difficulty: game.difficulty,
                initialGrid: game.initial_grid,
                currentGrid: game.current_grid,
                status: game.status,
                timeElapsed: 0,
                hintsUsed: 0,
                errorsMade: 0,
                createdAt: game.created_at
            }
        });

    } catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
};

// Get game by ID
const getGame = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await db.query(
            `SELECT id, user_id, difficulty, initial_grid, solution_grid, current_grid,
                    status, time_elapsed, hints_used, errors_made, score, 
                    completed_at, created_at
             FROM games
             WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const game = result.rows[0];

        res.json({
            game: {
                id: game.id,
                difficulty: game.difficulty,
                initialGrid: game.initial_grid,
                solutionGrid: game.solution_grid,
                currentGrid: game.current_grid,
                status: game.status,
                timeElapsed: game.time_elapsed,
                hintsUsed: game.hints_used,
                errorsMade: game.errors_made,
                score: game.score,
                completedAt: game.completed_at,
                createdAt: game.created_at
            }
        });

    } catch (error) {
        console.error('Get game error:', error);
        res.status(500).json({ error: 'Failed to get game' });
    }
};

// Update game state
const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { currentGrid, timeElapsed } = req.body;

        const result = await db.query(
            `UPDATE games
             SET current_grid = $1, time_elapsed = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND user_id = $4
             RETURNING id, current_grid, time_elapsed`,
            [JSON.stringify(currentGrid), timeElapsed, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json({
            message: 'Game updated successfully',
            game: result.rows[0]
        });

    } catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
};

// Make a move
const makeMove = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { row, col, value } = req.body;

        // Validate input
        if (row < 0 || row > 8 || col < 0 || col > 8 || value < 0 || value > 9) {
            return res.status(400).json({ error: 'Invalid move parameters' });
        }

        // Get game
        const gameResult = await db.query(
            'SELECT initial_grid, solution_grid, current_grid FROM games WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (gameResult.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const game = gameResult.rows[0];
        const initialGrid = game.initial_grid;
        const solutionGrid = game.solution_grid;
        const currentGrid = game.current_grid;

        // Check if cell is editable (not initial)
        if (initialGrid[row][col] !== 0) {
            return res.status(400).json({ error: 'Cannot modify initial cell' });
        }

        // Check if move is correct
        const isCorrect = solutionGrid[row][col] === value || value === 0;

        // Update grid
        currentGrid[row][col] = value;

        // Record move
        const moveNum = await db.query(
            'SELECT COUNT(*) as count FROM game_moves WHERE game_id = $1',
            [id]
        );

        await db.query(
            `INSERT INTO game_moves (game_id, move_number, row, col, value)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, parseInt(moveNum.rows[0].count) + 1, row, col, value]
        );

        // Update game grid
        await db.query(
            'UPDATE games SET current_grid = $1 WHERE id = $2',
            [JSON.stringify(currentGrid), id]
        );

        // Check for conflicts
        const conflicts = [];
        if (!isCorrect && value !== 0) {
            conflicts.push({ row, col });
        }

        res.json({
            message: 'Move recorded',
            isCorrect,
            conflicts,
            currentGrid
        });

    } catch (error) {
        console.error('Make move error:', error);
        res.status(500).json({ error: 'Failed to make move' });
    }
};

// Get hint
const getHint = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { level = 1 } = req.body;

        // Get game
        const result = await db.query(
            'SELECT current_grid, solution_grid, hints_used FROM games WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const game = result.rows[0];
        const currentGrid = game.current_grid;
        const solutionGrid = game.solution_grid;

        // Find empty cell
        let emptyCell = null;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentGrid[r][c] === 0) {
                    emptyCell = { row: r, col: c };
                    break;
                }
            }
            if (emptyCell) break;
        }

        if (!emptyCell) {
            return res.status(400).json({ error: 'No empty cells' });
        }

        // Update hints count
        await db.query(
            'UPDATE games SET hints_used = hints_used + 1 WHERE id = $1',
            [id]
        );

        const hint = {
            row: emptyCell.row,
            col: emptyCell.col,
            value: solutionGrid[emptyCell.row][emptyCell.col],
            level: level,
            technique: 'Single candidate'
        };

        res.json({ hint });

    } catch (error) {
        console.error('Get hint error:', error);
        res.status(500).json({ error: 'Failed to get hint' });
    }
};

// Complete game
const completeGame = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { timeElapsed, hintsUsed, errorsMade } = req.body;

        await db.transaction(async (client) => {
            // Get game
            const gameResult = await client.query(
                'SELECT difficulty, current_grid, solution_grid FROM games WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (gameResult.rows.length === 0) {
                throw new Error('Game not found');
            }

            const game = gameResult.rows[0];

            // Verify completion
            const currentGrid = game.current_grid;
            const solutionGrid = game.solution_grid;
            let isComplete = true;

            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (currentGrid[r][c] !== solutionGrid[r][c]) {
                        isComplete = false;
                        break;
                    }
                }
                if (!isComplete) break;
            }

            if (!isComplete) {
                return res.status(400).json({ error: 'Game is not complete' });
            }

            // Calculate score
            const score = calculator.calculateScore(
                game.difficulty,
                timeElapsed,
                hintsUsed,
                errorsMade
            );

            // Update game
            await client.query(
                `UPDATE games
                 SET status = 'completed', 
                     time_elapsed = $1, 
                     hints_used = $2, 
                     errors_made = $3,
                     score = $4,
                     completed_at = CURRENT_TIMESTAMP
                 WHERE id = $5`,
                [timeElapsed, hintsUsed, errorsMade, score, id]
            );

            // Update user statistics
            await client.query(
                `INSERT INTO user_statistics (user_id, total_games, games_won, total_time, total_hints, total_errors)
                 VALUES ($1, 1, 1, $2, $3, $4)
                 ON CONFLICT (user_id)
                 DO UPDATE SET
                     total_games = user_statistics.total_games + 1,
                     games_won = user_statistics.games_won + 1,
                     total_time = user_statistics.total_time + $2,
                     total_hints = user_statistics.total_hints + $3,
                     total_errors = user_statistics.total_errors + $4`,
                [userId, timeElapsed, hintsUsed, errorsMade]
            );

            // Add to leaderboard if qualifies
            if (calculator.qualifiesForLeaderboard(score, game.difficulty)) {
                await client.query(
                    `INSERT INTO leaderboard (user_id, game_id, score, time, difficulty)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [userId, id, score, timeElapsed, game.difficulty]
                );
            }

            res.json({
                message: 'Game completed successfully',
                score,
                timeElapsed,
                hintsUsed,
                errorsMade,
                difficulty: game.difficulty
            });
        });

    } catch (error) {
        console.error('Complete game error:', error);
        res.status(500).json({ error: 'Failed to complete game' });
    }
};

// Get user's games
const getUserGames = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, limit = 10 } = req.query;

        let query = `
            SELECT id, difficulty, status, time_elapsed, hints_used, errors_made, score, 
                   completed_at, created_at
            FROM games
            WHERE user_id = $1
        `;

        const params = [userId];

        if (status) {
            query += ' AND status = $2';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);

        res.json({
            games: result.rows
        });

    } catch (error) {
        console.error('Get user games error:', error);
        res.status(500).json({ error: 'Failed to get games' });
    }
};

module.exports = {
    createGame,
    getGame,
    updateGame,
    makeMove,
    getHint,
    completeGame,
    getUserGames
};
