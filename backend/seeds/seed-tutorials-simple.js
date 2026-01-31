#!/usr/bin/env node
/**
 * SEED-TUTORIALS-SIMPLE.JS - Seed Tutorials Without .env File
 * 
 * Usage:
 *   node seed-tutorials-simple.js
 *   
 * Or with custom credentials:
 *   node seed-tutorials-simple.js postgres mypassword sudoku_learning_platform
 */

const { Pool } = require('pg');
const readline = require('readline');

// Get credentials from command line or prompt
const args = process.argv.slice(2);
const DB_USER = args[0] || process.env.DB_USER;
const DB_PASSWORD = args[1] || process.env.DB_PASSWORD;
const DB_NAME = args[2] || process.env.DB_NAME || 'sudoku_learning_platform';

async function promptForPassword() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter PostgreSQL password: ', (password) => {
            rl.close();
            resolve(password);
        });
    });
}

async function main() {
    let user = DB_USER;
    let password = DB_PASSWORD;
    let database = DB_NAME;

    // Prompt for credentials if not provided
    if (!user) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        user = await new Promise((resolve) => {
            rl.question('PostgreSQL username (default: postgres): ', (answer) => {
                resolve(answer || 'postgres');
            });
        });
        
        database = await new Promise((resolve) => {
            rl.question('Database name (default: sudoku_learning_platform): ', (answer) => {
                rl.close();
                resolve(answer || 'sudoku_learning_platform');
            });
        });
    }

    if (!password) {
        password = await promptForPassword();
    }

    console.log('\n🌱 Seeding tutorials...');
    console.log(`   Database: ${database}`);
    console.log(`   User: ${user}\n`);

    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        user: user,
        password: String(password),
        database: database,
    });

    const tutorials = [
        {
            title: 'Introduction to Sudoku',
            slug: 'introduction',
            description: 'Learn the basic rules and how to get started with Sudoku',
            difficulty: 'beginner',
            duration_minutes: 15,
            icon: '📖',
            order_index: 1,
            content: {
                sections: [
                    {
                        title: 'What is Sudoku?',
                        content: 'Sudoku is a logic-based number puzzle game. The objective is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids contains all of the digits from 1 to 9.\n\nSudoku does not require mathematical knowledge. It is purely a logic puzzle where you use deduction to find the correct placement of numbers.',
                        example: '3 _ _ | _ 7 _ | _ _ 4\n_ _ 7 | _ _ _ | 3 _ _\n_ 8 _ | _ _ _ | _ 1 _\n------+-------+------',
                        tips: [
                            'Start with rows, columns, or boxes that have the most numbers',
                            'Look for cells where only one number can fit',
                            'Use pencil marks to keep track of possibilities'
                        ]
                    },
                    {
                        title: 'The Rules',
                        content: 'Sudoku has three simple rules:\n\n1. Each row must contain the numbers 1-9, without repetition\n2. Each column must contain the numbers 1-9, without repetition\n3. Each 3×3 box must contain the numbers 1-9, without repetition\n\nThat is all! Simple rules, but the puzzle can be quite challenging.',
                        tips: [
                            'You cannot guess - every move must be logical',
                            'Every valid Sudoku has exactly one solution',
                            'Numbers can appear multiple times in the grid, just not in the same row, column, or box'
                        ]
                    }
                ]
            }
        },
        {
            title: 'Single Candidate Technique',
            slug: 'single-candidate',
            description: 'Learn to identify cells where only one number can fit',
            difficulty: 'beginner',
            duration_minutes: 20,
            icon: '🎯',
            order_index: 2,
            content: {
                sections: [
                    {
                        title: 'What is Single Candidate?',
                        content: 'The Single Candidate technique (also called "Naked Single") is the most basic Sudoku solving technique. It involves finding a cell where only one number is possible based on the current state of the row, column, and box.',
                        example: 'If a cell\'s row already has 1,2,3,4,5,6,7,8, then the cell must be 9!',
                        tips: [
                            'Check each constraint: row, column, and box',
                            'Look for cells in rows/columns/boxes with many numbers',
                            'This technique alone can solve easy puzzles'
                        ]
                    }
                ]
            }
        },
        {
            title: 'Hidden Singles',
            slug: 'hidden-singles',
            description: 'Find numbers that can only go in one place within a unit',
            difficulty: 'beginner',
            duration_minutes: 25,
            icon: '🔍',
            order_index: 3,
            content: {
                sections: [
                    {
                        title: 'What are Hidden Singles?',
                        content: 'A Hidden Single occurs when a number can only fit in one cell within a row, column, or box, even though that cell might have other candidate numbers.',
                        tips: [
                            'Scan one number at a time across rows/columns/boxes',
                            'Look for numbers that appear frequently',
                            'Check all three units: row, column, and box'
                        ]
                    }
                ]
            }
        },
        {
            title: 'Naked Pairs & Triples',
            slug: 'naked-pairs',
            description: 'Use pairs and triples to eliminate candidates',
            difficulty: 'intermediate',
            duration_minutes: 30,
            icon: '👥',
            order_index: 4,
            content: {
                sections: [
                    {
                        title: 'What are Naked Pairs?',
                        content: 'A Naked Pair occurs when two cells in the same unit can only contain the same two numbers. When you find a naked pair, you can eliminate those two numbers from all other cells in that unit.',
                        tips: [
                            'Look for cells with exactly two candidates',
                            'They don\'t need to be next to each other',
                            'Works the same for rows, columns, and boxes'
                        ]
                    }
                ]
            }
        },
        {
            title: 'Advanced Techniques',
            slug: 'advanced-techniques',
            description: 'X-Wing, Swordfish, and other advanced solving strategies',
            difficulty: 'advanced',
            duration_minutes: 45,
            icon: '🎓',
            order_index: 5,
            content: {
                sections: [
                    {
                        title: 'X-Wing Pattern',
                        content: 'X-Wing is a powerful technique for eliminating candidates. It occurs when a candidate appears exactly twice in two different rows (or columns), and those appearances form a rectangle.',
                        tips: [
                            'Look for candidate numbers that appear exactly twice in rows',
                            'Check if those positions align in columns',
                            'Practice with puzzles specifically designed for X-Wings'
                        ]
                    }
                ]
            }
        }
    ];

    const client = await pool.connect();
    
    try {
        console.log('📝 Inserting tutorials...\n');

        for (const tutorial of tutorials) {
            await client.query(
                `INSERT INTO tutorials 
                    (title, slug, description, difficulty, duration_minutes, icon, order_index, content)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (slug) DO UPDATE SET
                    title = $1,
                    description = $3,
                    difficulty = $4,
                    duration_minutes = $5,
                    icon = $6,
                    order_index = $7,
                    content = $8`,
                [
                    tutorial.title,
                    tutorial.slug,
                    tutorial.description,
                    tutorial.difficulty,
                    tutorial.duration_minutes,
                    tutorial.icon,
                    tutorial.order_index,
                    JSON.stringify(tutorial.content)
                ]
            );
            console.log(`   ✓ ${tutorial.title}`);
        }

        console.log('\n✅ Successfully seeded 5 tutorials!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding tutorials:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run
main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
