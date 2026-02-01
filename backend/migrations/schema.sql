/**
 * SCHEMA.SQL - Complete Database Schema
 * Sudoku Learning Platform
 */

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS TABLE ====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    is_guest BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ==================== GAMES TABLE ====================
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('very-easy', 'easy', 'medium', 'hard', 'expert')),
    initial_grid JSONB NOT NULL,
    solution_grid JSONB NOT NULL,
    current_grid JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    time_elapsed INTEGER DEFAULT 0, -- in seconds
    hints_used INTEGER DEFAULT 0,
    errors_made INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_difficulty ON games(difficulty);

-- ==================== GAME MOVES TABLE ====================
CREATE TABLE game_moves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    move_number INTEGER NOT NULL,
    row INTEGER NOT NULL CHECK (row >= 0 AND row <= 8),
    col INTEGER NOT NULL CHECK (col >= 0 AND col <= 8),
    value INTEGER CHECK (value >= 0 AND value <= 9),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_moves_game_id ON game_moves(game_id);

-- ==================== TUTORIALS TABLE ====================
CREATE TABLE tutorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    icon VARCHAR(10),
    order_index INTEGER,
    content JSONB NOT NULL, -- sections, quiz, etc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tutorials_slug ON tutorials(slug);
CREATE INDEX idx_tutorials_difficulty ON tutorials(difficulty);

-- ==================== USER TUTORIAL PROGRESS ====================
CREATE TABLE user_tutorial_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    quiz_score INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tutorial_id)
);

CREATE INDEX idx_tutorial_progress_user ON user_tutorial_progress(user_id);

-- ==================== TECHNIQUES TABLE ====================
CREATE TABLE techniques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('basic', 'intermediate', 'advanced')),
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
    description TEXT,
    icon VARCHAR(10),
    when_to_use TEXT,
    steps JSONB NOT NULL, -- array of step descriptions
    example_puzzle JSONB,
    mastery_requirement INTEGER DEFAULT 5,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_techniques_slug ON techniques(slug);
CREATE INDEX idx_techniques_category ON techniques(category);

-- ==================== USER TECHNIQUE MASTERY ====================
CREATE TABLE user_technique_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES techniques(id) ON DELETE CASCADE,
    practice_count INTEGER DEFAULT 0,
    last_practiced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, technique_id)
);

CREATE INDEX idx_technique_mastery_user ON user_technique_mastery(user_id);

-- ==================== ACHIEVEMENTS TABLE ====================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    type VARCHAR(50) CHECK (type IN ('games', 'perfect', 'streak', 'speed', 'technique')),
    requirement INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== USER ACHIEVEMENTS ====================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ==================== USER STATISTICS ====================
CREATE TABLE user_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_games INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- in seconds
    total_hints INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_play_date DATE,
    best_times JSONB DEFAULT '{}', -- {difficulty: time}
    games_by_difficulty JSONB DEFAULT '{}', -- {difficulty: count}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_statistics_user ON user_statistics(user_id);

-- ==================== USER SETTINGS ====================
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    default_difficulty VARCHAR(20) DEFAULT 'easy',
    auto_save BOOLEAN DEFAULT true,
    show_timer BOOLEAN DEFAULT true,
    highlight_errors BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'light',
    cell_size VARCHAR(20) DEFAULT 'medium',
    sound_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== LEADERBOARD TABLE ====================
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time INTEGER NOT NULL, -- in seconds
    difficulty VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_time ON leaderboard(time ASC);
CREATE INDEX idx_leaderboard_difficulty ON leaderboard(difficulty);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_progress_updated_at BEFORE UPDATE ON user_tutorial_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_techniques_updated_at BEFORE UPDATE ON techniques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technique_mastery_updated_at BEFORE UPDATE ON user_technique_mastery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON user_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== VIEWS ====================

-- User profile with stats
CREATE VIEW user_profiles AS
SELECT 
    u.id,
    u.email,
    u.username,
    u.full_name,
    u.avatar_url,
    u.created_at,
    u.last_login,
    s.total_games,
    s.games_won,
    s.current_streak,
    s.longest_streak,
    COUNT(DISTINCT ua.achievement_id) as achievements_count
FROM users u
LEFT JOIN user_statistics s ON u.id = s.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, s.total_games, s.games_won, s.current_streak, s.longest_streak;

-- Recent games view
CREATE VIEW recent_games AS
SELECT 
    g.id,
    g.user_id,
    u.username,
    g.difficulty,
    g.status,
    g.time_elapsed,
    g.hints_used,
    g.errors_made,
    g.score,
    g.completed_at,
    g.created_at
FROM games g
JOIN users u ON g.user_id = u.id
ORDER BY g.created_at DESC;

-- Leaderboard view
CREATE VIEW leaderboard_view AS
SELECT 
    l.id,
    l.user_id,
    u.username,
    l.score,
    l.time,
    l.difficulty,
    l.created_at,
    ROW_NUMBER() OVER (PARTITION BY l.difficulty ORDER BY l.score DESC) as rank_by_score,
    ROW_NUMBER() OVER (PARTITION BY l.difficulty ORDER BY l.time ASC) as rank_by_time
FROM leaderboard l
JOIN users u ON l.user_id = u.id;

-- ==================== COMMENTS ====================
COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE games IS 'Game sessions with full state';
COMMENT ON TABLE tutorials IS 'Tutorial modules content';
COMMENT ON TABLE techniques IS 'Sudoku solving techniques library';
COMMENT ON TABLE achievements IS 'Achievement definitions';
COMMENT ON TABLE user_statistics IS 'Aggregated user statistics';
COMMENT ON TABLE leaderboard IS 'High score tracking';

-- ==================== INITIAL DATA ====================
-- Insert default achievements
INSERT INTO achievements (name, slug, description, icon, type, requirement) VALUES
('First Victory', 'first-victory', 'Complete your first game', '🎉', 'games', 1),
('Getting Started', 'getting-started', 'Complete 10 games', '🌟', 'games', 10),
('Dedicated Player', 'dedicated-player', 'Complete 50 games', '⭐', 'games', 50),
('Sudoku Master', 'sudoku-master', 'Complete 100 games', '👑', 'games', 100),
('Perfectionist', 'perfectionist', 'Complete a game without hints or errors', '💎', 'perfect', 1),
('Week Warrior', 'week-warrior', 'Maintain a 7-day streak', '🔥', 'streak', 7),
('Consistency King', 'consistency-king', 'Maintain a 30-day streak', '👑🔥', 'streak', 30),
('Speed Demon', 'speed-demon', 'Complete a game in under 5 minutes', '⚡', 'speed', 1);

COMMENT ON DATABASE sudoku_learning_platform IS 'Sudoku Learning Platform - Full-Stack Application';
