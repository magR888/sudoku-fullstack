/**
 * DATABASE.JS - PostgreSQL Connection Configuration
 */

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'sudoku_learning_platform',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✓ Database connected successfully');
        console.log('  Time:', result.rows[0].now);
        return true;
    } catch (err) {
        console.error('✗ Database connection failed:', err.message);
        throw err;
    }
};

// Query helper
const query = (text, params) => pool.query(text, params);

// Transaction helper
const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
