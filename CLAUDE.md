# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sudoku Learning Platform - a full-stack web application for learning and playing Sudoku with tutorials, technique library, statistics tracking, and achievements. Built with React frontend and Node.js/Express backend using PostgreSQL.

## Development Commands

### Backend (from `/backend`)
```bash
npm run dev        # Start with nodemon (auto-restart)
npm start          # Production start
npm run migrate    # Run database migrations
npm run seed       # Seed tutorial data
```

### Frontend (from `/frontend`)
```bash
npm start          # Development server with hot reload (port 3000)
npm run build      # Production build
npm test           # Run tests
```

### Database Setup
```bash
createdb sudoku_learning_platform
psql -d sudoku_learning_platform -f backend/migrations/schema.sql
cd backend && npm run seed
```

## Architecture

### Stack
- **Frontend**: React 18, React Router 6, Axios, Chart.js, Context API for auth state
- **Backend**: Express 4, PostgreSQL with `pg` driver (connection pooling), JWT auth, bcryptjs
- **Database**: PostgreSQL 14+ with UUID primary keys and JSONB for flexible data (grids, tutorial content)

### Key Patterns

**Authentication Flow**: JWT tokens (7-day expiry) stored in localStorage, sent via `Authorization: Bearer` header. Auth middleware at `backend/middleware/auth.js`. Token refresh endpoint available.

**API Structure**: RESTful endpoints under `/api/` prefix. Controllers in `backend/controllers/` handle business logic. Routes in `backend/routes/` define endpoints.

**Frontend Services**: `frontend/src/services/api.js` configures Axios with base URL and interceptors for token injection and 401 handling. Feature-specific services wrap API calls.

**State Management**: Context API for auth (`AuthContext.jsx`). Local component state for game UI. Auto-save during gameplay every 30 seconds.

### Database Schema

Core tables: `users`, `games`, `game_moves`, `tutorials`, `user_tutorial_progress`, `techniques`, `user_statistics`, `user_achievements`, `leaderboard`, `user_settings`

Grids stored as JSONB 9x9 arrays (`initial_grid`, `solution_grid`, `current_grid`). Tutorial content is flexible JSONB with sections and quiz structure.

### Game Logic

- **Puzzle Generation** (`backend/utils/sudokuGenerator.js`): Backtracking algorithm, removes cells based on difficulty (51 clues for very-easy down to 21 for expert)
- **Hint System**: Uses Minimum Remaining Values (MRV) algorithm to find optimal cell, returns technique explanation in Indonesian
- **Score Calculation** (`backend/utils/scoreCalculator.js`): Base 1000 points minus time/hint/error penalties, multiplied by difficulty factor (0.5x-2.5x)

### Environment Variables

Backend `.env`: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRE`, `CORS_ORIGIN`

Frontend `.env`: `REACT_APP_API_URL` (default: `http://localhost:5000/api`)

## Key Entry Points

- `backend/server.js` - Express app setup, middleware, route mounting
- `backend/config/database.js` - PostgreSQL pool and transaction helper
- `backend/controllers/gameController.js` - Core game logic (create, move, hint, complete)
- `frontend/src/App.jsx` - React routing with protected route wrappers
- `frontend/src/components/Game/GameBoard.jsx` - Main game UI component

## API Endpoints

**Auth**: `POST /register`, `POST /login`, `POST /guest-login`, `GET /me`, `POST /refresh`

**Games**: `POST /`, `GET /:id`, `PUT /:id`, `POST /:id/move`, `POST /:id/hint`, `POST /:id/complete`, `GET /user`

**Tutorials**: `GET /`, `GET /:id`, `GET /progress/me`, `POST /:id/progress`, `POST /:id/quiz`

**Statistics**: `GET /me`, `GET /achievements`, `GET /leaderboard`

All under `/api/` prefix (e.g., `/api/auth/login`, `/api/games`).
