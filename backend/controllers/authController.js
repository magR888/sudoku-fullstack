/**
 * AUTHCONTROLLER.JS - Authentication Controller
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Register new user
const register = async (req, res) => {
    try {
        const { email, username, password, full_name } = req.body;
        
        // Validation
        if (!email || !username || !password) {
            return res.status(400).json({ 
                error: 'Email, nama pengguna, dan kata sandi wajib diisi' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Kata sandi minimal 6 karakter' 
            });
        }
        
        // Check if user exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ 
                error: 'Email atau nama pengguna sudah terdaftar' 
            });
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Create user with transaction
        const result = await db.transaction(async (client) => {
            // Insert user
            const userResult = await client.query(
                `INSERT INTO users (email, username, password_hash, full_name)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, email, username, full_name, created_at`,
                [email, username, password_hash, full_name]
            );
            
            const user = userResult.rows[0];
            
            // Create initial statistics
            await client.query(
                `INSERT INTO user_statistics (user_id) VALUES ($1)`,
                [user.id]
            );
            
            // Create initial settings
            await client.query(
                `INSERT INTO user_settings (user_id) VALUES ($1)`,
                [user.id]
            );
            
            return user;
        });
        
        // Generate token
        const token = generateToken(result);
        
        res.status(201).json({
            message: 'Pengguna berhasil terdaftar',
            token,
            user: {
                id: result.id,
                email: result.email,
                username: result.username,
                full_name: result.full_name,
                created_at: result.created_at
            }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Pendaftaran gagal' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email dan kata sandi wajib diisi' 
            });
        }
        
        // Find user
        const result = await db.query(
            `SELECT id, email, username, password_hash, full_name, avatar_url, is_active
             FROM users
             WHERE email = $1`,
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Email atau kata sandi salah' 
            });
        }
        
        const user = result.rows[0];
        
        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({ 
                error: 'Akun dinonaktifkan. Silakan hubungi dukungan.' 
            });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Email atau kata sandi salah' 
            });
        }
        
        // Update last login
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );
        
        // Generate token
        const token = generateToken(user);
        
        res.json({
            message: 'Berhasil masuk',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                full_name: user.full_name,
                avatar_url: user.avatar_url
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Gagal masuk' });
    }
};

// Get current user
const me = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.id, u.email, u.username, u.full_name, u.avatar_url, 
                    u.created_at, u.last_login,
                    s.total_games, s.games_won, s.current_streak,
                    COUNT(DISTINCT ua.achievement_id) as achievements_count
             FROM users u
             LEFT JOIN user_statistics s ON u.id = s.user_id
             LEFT JOIN user_achievements ua ON u.id = ua.user_id
             WHERE u.id = $1
             GROUP BY u.id, s.total_games, s.games_won, s.current_streak`,
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }
        
        res.json({ user: result.rows[0] });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Gagal mendapatkan data pengguna' });
    }
};

// Logout (client-side mainly)
const logout = async (req, res) => {
    res.json({ message: 'Berhasil keluar' });
};

// Guest login - create temporary guest account
const guestLogin = async (req, res) => {
    try {
        // Generate random guest username
        const guestId = Math.random().toString(36).substring(2, 10);
        const guestUsername = `guest_${guestId}`;
        const guestEmail = `${guestUsername}@guest.sudoku.app`;
        const guestPassword = Math.random().toString(36).substring(2, 15);
        
        // Hash password
        const password_hash = await bcrypt.hash(guestPassword, 10);
        
        // Create guest user with transaction
        const result = await db.transaction(async (client) => {
            // Insert guest user
            const userResult = await client.query(
                `INSERT INTO users (email, username, password_hash, full_name, is_guest)
                 VALUES ($1, $2, $3, $4, true)
                 RETURNING id, email, username, full_name, created_at`,
                [guestEmail, guestUsername, password_hash, 'Guest User']
            );
            
            const user = userResult.rows[0];
            
            // Create initial statistics
            await client.query(
                `INSERT INTO user_statistics (user_id) VALUES ($1)`,
                [user.id]
            );
            
            // Create initial settings
            await client.query(
                `INSERT INTO user_settings (user_id) VALUES ($1)`,
                [user.id]
            );
            
            return user;
        });
        
        // Generate token
        const token = generateToken(result);
        
        res.status(201).json({
            message: 'Berhasil masuk sebagai tamu',
            token,
            user: {
                id: result.id,
                email: result.email,
                username: result.username,
                full_name: result.full_name,
                is_guest: true,
                created_at: result.created_at
            }
        });
        
    } catch (error) {
        console.error('Guest login error:', error);
        res.status(500).json({ error: 'Gagal masuk sebagai tamu' });
    }
};

// Refresh token
const refresh = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token diperlukan' });
        }
        
        // Verify old token (allow expired)
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: true
        });
        
        // Get fresh user data
        const result = await db.query(
            'SELECT id, email, username FROM users WHERE id = $1 AND is_active = true',
            [decoded.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Pengguna tidak ditemukan atau tidak aktif' });
        }
        
        // Generate new token
        const newToken = generateToken(result.rows[0]);
        
        res.json({ token: newToken });
        
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Token tidak valid' });
    }
};

module.exports = {
    register,
    login,
    guestLogin,
    me,
    logout,
    refresh
};
