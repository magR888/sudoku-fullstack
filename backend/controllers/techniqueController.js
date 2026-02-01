/**
 * TECHNIQUECONTROLLER.JS - Technique Management Controller
 */

const db = require('../config/database');

// Get all techniques
const getAllTechniques = async (req, res) => {
    try {
        const userId = req.user?.id;

        let result;
        if (userId) {
            // Include user mastery if authenticated
            result = await db.query(
                `SELECT t.id, t.name, t.slug, t.category, t.difficulty,
                        t.description, t.icon, t.order_index,
                        COALESCE(m.practice_count, 0) as practice_count,
                        m.last_practiced
                 FROM techniques t
                 LEFT JOIN user_technique_mastery m
                    ON t.id = m.technique_id AND m.user_id = $1
                 ORDER BY t.order_index`,
                [userId]
            );
        } else {
            result = await db.query(
                `SELECT id, name, slug, category, difficulty,
                        description, icon, order_index
                 FROM techniques
                 ORDER BY order_index`
            );
        }

        res.json({ techniques: result.rows });

    } catch (error) {
        console.error('Get techniques error:', error);
        res.status(500).json({ error: 'Failed to get techniques' });
    }
};

// Get technique by ID or slug
const getTechnique = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Get technique with full steps
        const techniqueResult = await db.query(
            `SELECT id, name, slug, category, difficulty,
                    description, icon, when_to_use, steps, example_puzzle,
                    mastery_requirement, order_index
             FROM techniques
             WHERE id::text = $1 OR slug = $1`,
            [id]
        );

        if (techniqueResult.rows.length === 0) {
            return res.status(404).json({ error: 'Technique not found' });
        }

        const technique = techniqueResult.rows[0];

        // Get user mastery if authenticated
        let mastery = null;
        if (userId) {
            const masteryResult = await db.query(
                `SELECT practice_count, last_practiced
                 FROM user_technique_mastery
                 WHERE user_id = $1 AND technique_id = $2`,
                [userId, technique.id]
            );

            if (masteryResult.rows.length > 0) {
                mastery = masteryResult.rows[0];
            }
        }

        res.json({
            technique: {
                ...technique,
                mastery
            }
        });

    } catch (error) {
        console.error('Get technique error:', error);
        res.status(500).json({ error: 'Failed to get technique' });
    }
};

// Get user's technique mastery
const getUserMastery = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await db.query(
            `SELECT m.technique_id, m.practice_count, m.last_practiced,
                    t.name, t.slug, t.category, t.difficulty, t.icon,
                    t.mastery_requirement
             FROM user_technique_mastery m
             JOIN techniques t ON m.technique_id = t.id
             WHERE m.user_id = $1
             ORDER BY m.last_practiced DESC`,
            [userId]
        );

        res.json({ mastery: result.rows });

    } catch (error) {
        console.error('Get user mastery error:', error);
        res.status(500).json({ error: 'Failed to get mastery' });
    }
};

// Record practice session
const recordPractice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify technique exists
        const techniqueResult = await db.query(
            `SELECT id FROM techniques WHERE id::text = $1 OR slug = $1`,
            [id]
        );

        if (techniqueResult.rows.length === 0) {
            return res.status(404).json({ error: 'Technique not found' });
        }

        const techniqueId = techniqueResult.rows[0].id;

        // Upsert mastery record
        const result = await db.query(
            `INSERT INTO user_technique_mastery
                (user_id, technique_id, practice_count, last_practiced)
             VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id, technique_id)
             DO UPDATE SET
                practice_count = user_technique_mastery.practice_count + 1,
                last_practiced = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, techniqueId]
        );

        res.json({
            message: 'Practice recorded',
            mastery: result.rows[0]
        });

    } catch (error) {
        console.error('Record practice error:', error);
        res.status(500).json({ error: 'Failed to record practice' });
    }
};

module.exports = {
    getAllTechniques,
    getTechnique,
    getUserMastery,
    recordPractice
};
