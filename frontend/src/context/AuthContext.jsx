/**
 * AUTHCONTEXT.JSX - Authentication Context
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = authService.getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            setError(null);
            const data = await authService.register(userData);
            setUser(data.user);
            return data;
        } catch (err) {
            const message = err.response?.data?.error || 'Pendaftaran gagal';
            setError(message);
            throw new Error(message);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (err) {
            const message = err.response?.data?.error || 'Gagal masuk';
            setError(message);
            throw new Error(message);
        }
    };

    const guestLogin = async () => {
        try {
            setError(null);
            const data = await authService.guestLogin();
            setUser(data.user);
            return data;
        } catch (err) {
            const message = err.response?.data?.error || 'Gagal masuk sebagai tamu';
            setError(message);
            throw new Error(message);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        guestLogin,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
