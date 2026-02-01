/**
 * TECHNIQUESERVICE.JS - Technique API Service
 */

import api from './api';

const techniqueService = {
    // Get all techniques
    getAllTechniques: async () => {
        const response = await api.get('/techniques');
        return response.data.techniques;
    },

    // Get technique by ID or slug
    getTechnique: async (id) => {
        const response = await api.get(`/techniques/${id}`);
        return response.data.technique;
    },

    // Get user's technique mastery
    getUserMastery: async () => {
        const response = await api.get('/techniques/mastery/me');
        return response.data.mastery;
    },

    // Record practice session
    recordPractice: async (techniqueId) => {
        const response = await api.post(`/techniques/${techniqueId}/practice`);
        return response.data;
    }
};

export default techniqueService;
