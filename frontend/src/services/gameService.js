/**
 * GAMESERVICE.JS - Game API Service
 */

import api from './api';

const gameService = {
    // Create new game
    createGame: async (difficulty) => {
        const response = await api.post('/games', { difficulty });
        return response.data.game;
    },

    // Get game by ID
    getGame: async (gameId) => {
        const response = await api.get(`/games/${gameId}`);
        return response.data.game;
    },

    // Update game state
    updateGame: async (gameId, gameData) => {
        const response = await api.put(`/games/${gameId}`, gameData);
        return response.data.game;
    },

    // Make a move
    makeMove: async (gameId, move) => {
        const response = await api.post(`/games/${gameId}/move`, move);
        return response.data;
    },

    // Get hint
    getHint: async (gameId, level = 1) => {
        const response = await api.post(`/games/${gameId}/hint`, { level });
        return response.data.hint;
    },

    // Complete game
    completeGame: async (gameId, gameData) => {
        const response = await api.post(`/games/${gameId}/complete`, gameData);
        return response.data;
    },

    // Get user's games
    getUserGames: async (status = null, limit = 10) => {
        const params = { limit };
        if (status) params.status = status;
        const response = await api.get('/games/user', { params });
        return response.data.games;
    }
};

export default gameService;
