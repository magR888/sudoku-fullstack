/**
 * APP.JSX - Main Application Component
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import StatisticsPage from './pages/StatisticsPage';
import TutorialsPage from './pages/TutorialsPage';
import TutorialDetailPage from './pages/TutorialDetailPage';
import TechniqueLearningPage from './pages/TechniqueLearningPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public Route wrapper (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return !isAuthenticated() ? children : <Navigate to="/" />;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } 
            />

            {/* Protected Routes */}
            <Route 
                path="/" 
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/game/:id" 
                element={
                    <ProtectedRoute>
                        <GamePage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/statistics" 
                element={
                    <ProtectedRoute>
                        <StatisticsPage />
                    </ProtectedRoute>
                } 
            />

            {/* Tutorial Routes - Public */}
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/tutorials/:id" element={<TutorialDetailPage />} />
            
            {/* Technique Learning - Public */}
            <Route path="/learn-techniques" element={<TechniqueLearningPage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app">
                    <AppRoutes />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
