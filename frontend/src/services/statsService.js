/**
 * STATSSERVICE.JS - Statistics API Service
 */

import api from './api';

const statsService = {
    // Get user statistics
    getMyStatistics: async () => {
        const response = await api.get('/statistics/me');
        return response.data.statistics;
    },

    // Get achievements
    getAchievements: async () => {
        const response = await api.get('/statistics/achievements');
        return response.data.achievements;
    },

    // Get leaderboard
    getLeaderboard: async (type = 'score', difficulty = 'all', limit = 10) => {
        const response = await api.get('/statistics/leaderboard', {
            params: { type, difficulty, limit }
        });
        return response.data.leaderboard;
    }
};

export default statsService;
