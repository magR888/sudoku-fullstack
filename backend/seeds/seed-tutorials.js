/**
 * SEED-TUTORIALS.JS - Seed Sample Tutorial Data
 */

// Load environment variables
require('dotenv').config();

const { Pool } = require('pg');

// Verify password is loaded
if (!process.env.DB_PASSWORD) {
    console.error('❌ ERROR: DB_PASSWORD not set in .env file!');
    console.log('Please create .env file with:');
    console.log('DB_PASSWORD=your_password_here');
    process.exit(1);
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD), // Ensure it's a string
    database: process.env.DB_NAME || 'sudoku_learning_platform',
});

console.log('🔌 Connecting to database...');
console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`   Database: ${process.env.DB_NAME || 'sudoku_learning_platform'}`);
console.log(`   User: ${process.env.DB_USER || 'postgres'}`);

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
                },
                {
                    title: 'Getting Started',
                    content: 'To solve a Sudoku puzzle:\n\n1. Scan the grid to find cells where only one number can fit\n2. Start with the rows, columns, and boxes that have the most numbers filled in\n3. Use the process of elimination to narrow down possibilities\n4. Fill in the certain numbers first\n5. Repeat the process until the grid is complete',
                    tips: [
                        'Be patient - some puzzles take time',
                        'Practice regularly to improve',
                        'Start with easy puzzles and work your way up'
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
                    content: 'The Single Candidate technique (also called "Naked Single") is the most basic Sudoku solving technique. It involves finding a cell where only one number is possible based on the current state of the row, column, and box.\n\nThis is often the first technique beginners learn and use throughout the entire solving process.',
                    example: 'If a cell\'s row already has 1,2,3,4,5,6,7,8, then the cell must be 9!',
                    tips: [
                        'Check each constraint: row, column, and box',
                        'Look for cells in rows/columns/boxes with many numbers',
                        'This technique alone can solve easy puzzles'
                    ]
                },
                {
                    title: 'How to Apply',
                    content: 'Steps to find single candidates:\n\n1. Look at an empty cell\n2. Check which numbers 1-9 are already in its row\n3. Check which numbers are already in its column\n4. Check which numbers are already in its 3×3 box\n5. If only one number is not present in all three constraints, that is the answer!\n\nThis is a very straightforward technique that requires careful observation.',
                    tips: [
                        'Scan systematically - don\'t skip cells',
                        'Double-check your work before filling',
                        'Use pencil marks if you\'re solving on paper'
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
                    content: 'A Hidden Single occurs when a number can only fit in one cell within a row, column, or box, even though that cell might have other candidate numbers.\n\nFor example, if the number 7 can only go in one cell of a row (even if that cell could also be 2 or 5), then it must be 7.',
                    tips: [
                        'Scan one number at a time across rows/columns/boxes',
                        'Look for numbers that appear frequently',
                        'Check all three units: row, column, and box'
                    ]
                },
                {
                    title: 'Finding Hidden Singles',
                    content: 'To find hidden singles:\n\n1. Pick a number (say, 7)\n2. Look at a row, column, or box\n3. Check all empty cells in that unit\n4. If 7 can only fit in one of those cells, you found a hidden single!\n5. Repeat for all numbers 1-9\n\nThis technique is more powerful than scanning for naked singles.',
                    tips: [
                        'Start with numbers that appear frequently in the puzzle',
                        'Focus on units that are nearly complete',
                        'Practice makes this technique much faster'
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
                    content: 'A Naked Pair occurs when two cells in the same unit (row, column, or box) can only contain the same two numbers.\n\nWhen you find a naked pair, you can eliminate those two numbers from all other cells in that unit.\n\nFor example, if two cells can only be {2,5}, then no other cell in that row can be 2 or 5.',
                    tips: [
                        'Look for cells with exactly two candidates',
                        'They don\'t need to be next to each other',
                        'Works the same for rows, columns, and boxes'
                    ]
                },
                {
                    title: 'Naked Triples',
                    content: 'Naked Triples work the same way but with three numbers and three cells.\n\nIf three cells in a unit contain only combinations of the same three numbers (like {2,5,7}), then those three numbers can be eliminated from all other cells in that unit.\n\nNote: The three cells don\'t each need to have all three numbers - they just need to collectively contain only those three numbers.',
                    tips: [
                        'Triples are harder to spot than pairs',
                        'The cells can have 2 or 3 candidates each',
                        'Check your eliminations carefully'
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
                    content: 'X-Wing is a powerful technique for eliminating candidates. It occurs when a candidate appears exactly twice in two different rows (or columns), and those appearances form a rectangle.\n\nWhen you find an X-Wing, you can eliminate that candidate from all other cells in the columns (or rows) where the X-Wing appears.\n\nThis technique requires good pattern recognition skills.',
                    tips: [
                        'Look for candidate numbers that appear exactly twice in rows',
                        'Check if those positions align in columns',
                        'Practice with puzzles specifically designed for X-Wings'
                    ]
                },
                {
                    title: 'Swordfish',
                    content: 'Swordfish is an extension of X-Wing but with three rows and three columns instead of two.\n\nWhen a candidate appears 2-3 times in three different rows, and all occurrences are in the same three columns (or vice versa), you have a Swordfish.\n\nYou can then eliminate that candidate from all other cells in those three columns.',
                    tips: [
                        'Swordfish is rare - don\'t rely on it',
                        'Easier to find in harder puzzles',
                        'Master X-Wing before attempting Swordfish'
                    ]
                },
                {
                    title: 'Coloring & Chains',
                    content: 'Advanced techniques like Simple Coloring and X-Chains involve following logical chains of implications.\n\nThese techniques are typically only needed for the hardest puzzles and require significant practice to master.\n\nMost puzzles can be solved without these advanced techniques using the beginner and intermediate methods.',
                    tips: [
                        'Only learn these if you\'re solving expert puzzles',
                        'They take time to master',
                        'Computer solvers use these extensively'
                    ]
                }
            ]
        }
    }
];

async function seedTutorials() {
    const client = await pool.connect();
    
    try {
        console.log('🌱 Seeding tutorials...');

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
            console.log(`✓ Added: ${tutorial.title}`);
        }

        console.log('✅ Tutorials seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding tutorials:', error);
        process.exit(1);
    } finally {
        client.release();
    }
}

// Run if called directly
if (require.main === module) {
    seedTutorials();
}

module.exports = seedTutorials;
