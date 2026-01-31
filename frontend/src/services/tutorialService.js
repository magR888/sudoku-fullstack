/**
 * TUTORIALSERVICE.JS - Tutorial API Service
 */

import api from './api';

const tutorialService = {
    // Get all tutorials
    getAllTutorials: async () => {
        const response = await api.get('/tutorials');
        return response.data.tutorials;
    },

    // Get tutorial by ID
    getTutorial: async (id) => {
        const response = await api.get(`/tutorials/${id}`);
        return response.data.tutorial;
    },

    // Get user's tutorial progress
    getUserProgress: async () => {
        const response = await api.get('/tutorials/progress/me');
        return response.data.progress;
    },

    // Update progress
    updateProgress: async (tutorialId, progressData) => {
        const response = await api.post(`/tutorials/${tutorialId}/progress`, progressData);
        return response.data.progress;
    },

    // Submit quiz
    submitQuiz: async (tutorialId, quizData) => {
        const response = await api.post(`/tutorials/${tutorialId}/quiz`, quizData);
        return response.data;
    }
};

export default tutorialService;
