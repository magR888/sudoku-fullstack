/**
 * SCORECALCULATOR.JS - Game Score Calculator
 */

class ScoreCalculator {
    constructor() {
        this.baseScore = 1000;
        this.difficultyMultipliers = {
            'very-easy': 0.5,
            'easy': 1.0,
            'medium': 1.5,
            'hard': 2.0,
            'expert': 2.5
        };
    }

    /**
     * Calculate final score
     * @param {string} difficulty - Game difficulty
     * @param {number} timeElapsed - Time in seconds
     * @param {number} hintsUsed - Number of hints used
     * @param {number} errorsMade - Number of errors made
     * @returns {number} Final score
     */
    calculateScore(difficulty, timeElapsed, hintsUsed, errorsMade) {
        const multiplier = this.difficultyMultipliers[difficulty] || 1.0;
        
        // Time penalty (2 points per second)
        const timePenalty = Math.floor(timeElapsed * 2);
        
        // Hint penalty (30 points per hint)
        const hintPenalty = hintsUsed * 30;
        
        // Error penalty (50 points per error)
        const errorPenalty = errorsMade * 50;
        
        // Calculate raw score
        let score = this.baseScore - timePenalty - hintPenalty - errorPenalty;
        
        // Apply difficulty multiplier
        score = Math.floor(score * multiplier);
        
        // Minimum score is 0
        return Math.max(0, score);
    }

    /**
     * Calculate score breakdown for display
     */
    calculateBreakdown(difficulty, timeElapsed, hintsUsed, errorsMade) {
        const multiplier = this.difficultyMultipliers[difficulty] || 1.0;
        const timePenalty = Math.floor(timeElapsed * 2);
        const hintPenalty = hintsUsed * 30;
        const errorPenalty = errorsMade * 50;
        
        const rawScore = this.baseScore - timePenalty - hintPenalty - errorPenalty;
        const finalScore = Math.max(0, Math.floor(rawScore * multiplier));
        
        return {
            baseScore: this.baseScore,
            timePenalty: timePenalty,
            hintPenalty: hintPenalty,
            errorPenalty: errorPenalty,
            rawScore: rawScore,
            multiplier: multiplier,
            finalScore: finalScore
        };
    }

    /**
     * Check if score qualifies for leaderboard
     * @param {number} score - Player's score
     * @param {string} difficulty - Game difficulty
     * @returns {boolean} True if qualifies
     */
    qualifiesForLeaderboard(score, difficulty) {
        const minimumScores = {
            'very-easy': 100,
            'easy': 200,
            'medium': 300,
            'hard': 400,
            'expert': 500
        };
        
        const minimum = minimumScores[difficulty] || 200;
        return score >= minimum;
    }
}

module.exports = ScoreCalculator;
