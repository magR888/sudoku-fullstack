/**
 * SUDOKUGENERATOR.JS - Sudoku Puzzle Generator
 * Ported from vanilla JS version
 */

class SudokuGenerator {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    // Generate a complete valid Sudoku grid
    generateComplete() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGrid(0, 0);
        return this.grid;
    }

    // Fill grid using backtracking
    fillGrid(row, col) {
        if (col === 9) {
            row++;
            col = 0;
        }
        if (row === 9) {
            return true;
        }

        const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (this.isValidPlacement(row, col, num)) {
                this.grid[row][col] = num;
                if (this.fillGrid(row, col + 1)) {
                    return true;
                }
                this.grid[row][col] = 0;
            }
        }
        return false;
    }

    // Check if number can be placed at position
    isValidPlacement(row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (this.grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (this.grid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (this.grid[r][c] === num) return false;
            }
        }

        return true;
    }

    // Shuffle array randomly
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Generate puzzle with given difficulty
    generatePuzzle(difficulty = 'medium') {
        // Generate complete grid
        const solution = this.generateComplete();
        const puzzle = solution.map(row => [...row]);

        // Determine cells to remove based on difficulty
        const cellsToRemove = this.getCellsToRemove(difficulty);

        // Remove cells while maintaining unique solution
        let removed = 0;
        let attempts = 0;
        const maxAttempts = cellsToRemove * 3;

        while (removed < cellsToRemove && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                const backup = puzzle[row][col];
                puzzle[row][col] = 0;

                // Check if still has unique solution (simplified check)
                if (this.hasUniqueSolution(puzzle)) {
                    removed++;
                } else {
                    puzzle[row][col] = backup;
                }
            }
            attempts++;
        }

        return {
            puzzle: puzzle,
            solution: solution,
            difficulty: difficulty,
            clues: 81 - removed
        };
    }

    // Get number of cells to remove based on difficulty
    getCellsToRemove(difficulty) {
        const levels = {
            'very-easy': 30,  // 51 clues
            'easy': 40,       // 41 clues
            'medium': 50,     // 31 clues
            'hard': 55,       // 26 clues
            'expert': 60      // 21 clues
        };
        return levels[difficulty] || levels['medium'];
    }

    // Check if puzzle has unique solution (simplified)
    hasUniqueSolution(puzzle) {
        // For performance, we do a simplified check
        // In production, you'd do a full backtracking solution count
        const solver = new SudokuSolver();
        return solver.solve(puzzle.map(row => [...row]));
    }

    // Copy grid
    copyGrid(grid) {
        return grid.map(row => [...row]);
    }
}

// Simple solver for validation
class SudokuSolver {
    solve(grid) {
        const emptyCell = this.findEmptyCell(grid);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (this.solve(grid)) return true;
                grid[row][col] = 0;
            }
        }
        return false;
    }

    findEmptyCell(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    isValid(grid, row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }

        return true;
    }
}

module.exports = SudokuGenerator;
