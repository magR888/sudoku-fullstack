/**
 * SEED-TECHNIQUES.JS - Seed techniques data
 * Run: node seeds/seed-techniques.js
 */

require('dotenv').config();
const db = require('../config/database');

const techniques = [
    {
        name: 'Naked Single',
        slug: 'naked-single',
        category: 'basic',
        difficulty: 1,
        description: 'Teknik paling dasar - menemukan sel yang hanya memiliki 1 kandidat angka',
        icon: '🎯',
        when_to_use: 'Gunakan ketika sebuah sel hanya memiliki satu angka yang mungkin berdasarkan eliminasi dari baris, kolom, dan kotak 3x3.',
        order_index: 1,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Naked Single',
                explanation: 'Naked Single adalah teknik paling fundamental dalam Sudoku. Sebuah sel disebut "Naked Single" jika hanya ada SATU angka yang mungkin di sel tersebut.',
                grid: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 2]],
                instruction: 'Perhatikan sel di Baris 1, Kolom 3 (highlight kuning). Mari kita analisis sel ini!'
            },
            {
                title: 'Analisis Baris',
                explanation: 'Langkah pertama: Cek angka apa saja yang sudah ada di BARIS 1',
                grid: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 0], [0, 1], [0, 4]],
                highlightRow: 0,
                instruction: 'Di Baris 1 sudah ada: 5, 3, 7',
                usedNumbers: { row: [5, 3, 7] }
            },
            {
                title: 'Analisis Kolom',
                explanation: 'Langkah kedua: Cek angka apa saja yang sudah ada di KOLOM 3',
                grid: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[2, 2]],
                highlightCol: 2,
                instruction: 'Di Kolom 3 sudah ada: 8',
                usedNumbers: { row: [5, 3, 7], col: [8] }
            },
            {
                title: 'Analisis Kotak 3×3',
                explanation: 'Langkah ketiga: Cek angka apa saja yang sudah ada di KOTAK 3×3 (kiri atas)',
                grid: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 0], [0, 1], [1, 0], [2, 1], [2, 2]],
                highlightBox: 0,
                instruction: 'Di Kotak 3×3 sudah ada: 5, 3, 6, 9, 8',
                usedNumbers: { row: [5, 3, 7], col: [8], box: [5, 3, 6, 9, 8] }
            },
            {
                title: 'Eliminasi',
                explanation: 'Sekarang kita gabungkan semua angka yang sudah terpakai',
                grid: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 2]],
                instruction: 'Angka yang sudah ada: 3, 5, 6, 7, 8, 9. Angka yang masih mungkin: 1, 2, 4',
                candidates: [1, 2, 4],
                usedNumbers: { all: [3, 5, 6, 7, 8, 9] }
            },
            {
                title: 'Naked Single Ditemukan!',
                explanation: 'Dengan analisis lebih lanjut (cek row/column/box lain), kita temukan hanya angka 4 yang valid!',
                grid: [
                    [5, 3, 4, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 2]],
                answer: 4,
                instruction: 'Sel ini adalah NAKED SINGLE dengan nilai 4! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Coba temukan Naked Single di grid ini!',
            grid: [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 5, 0, 0, 1],
                [0, 0, 1, 8, 0, 6, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ],
            answerCell: [4, 4],
            answerValue: 5,
            hint: 'Lihat sel di tengah-tengah board (row 5, col 5)!'
        }
    },
    {
        name: 'Hidden Single',
        slug: 'hidden-single',
        category: 'basic',
        difficulty: 2,
        description: 'Menemukan angka yang hanya bisa di satu tempat dalam row/column/box',
        icon: '🔍',
        when_to_use: 'Gunakan ketika sebuah angka hanya bisa ditempatkan di satu sel dalam suatu baris, kolom, atau kotak 3x3.',
        order_index: 2,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Hidden Single',
                explanation: 'Hidden Single terjadi ketika sebuah angka hanya bisa ditempatkan di SATU sel dalam row, column, atau box - meskipun sel tersebut punya kandidat lain.',
                grid: [
                    [0, 0, 0, 2, 6, 0, 7, 0, 1],
                    [6, 8, 0, 0, 7, 0, 0, 9, 0],
                    [1, 9, 0, 0, 0, 4, 5, 0, 0],
                    [8, 2, 0, 1, 0, 0, 0, 4, 0],
                    [0, 0, 4, 6, 0, 2, 9, 0, 0],
                    [0, 5, 0, 0, 0, 3, 0, 2, 8],
                    [0, 0, 9, 3, 0, 0, 0, 7, 4],
                    [0, 4, 0, 0, 5, 0, 0, 3, 6],
                    [7, 0, 3, 0, 1, 8, 0, 0, 0]
                ],
                instruction: 'Mari kita cari dimana angka 3 bisa ditempatkan di Row 1'
            },
            {
                title: 'Scan Row untuk Angka 3',
                explanation: 'Kita scan Row 1 untuk mencari dimana angka 3 bisa ditempatkan',
                grid: [
                    [0, 0, 0, 2, 6, 0, 7, 0, 1],
                    [6, 8, 0, 0, 7, 0, 0, 9, 0],
                    [1, 9, 0, 0, 0, 4, 5, 0, 0],
                    [8, 2, 0, 1, 0, 0, 0, 4, 0],
                    [0, 0, 4, 6, 0, 2, 9, 0, 0],
                    [0, 5, 0, 0, 0, 3, 0, 2, 8],
                    [0, 0, 9, 3, 0, 0, 0, 7, 4],
                    [0, 4, 0, 0, 5, 0, 0, 3, 6],
                    [7, 0, 3, 0, 1, 8, 0, 0, 0]
                ],
                highlightRow: 0,
                highlightCells: [[0, 0], [0, 1], [0, 2], [0, 5], [0, 7]],
                instruction: 'Kandidat untuk angka 3: kolom 1, 2, 3, 6, 8'
            },
            {
                title: 'Eliminasi dengan Box',
                explanation: 'Periksa kotak 3×3. Di kotak pertama, kolom 3 sudah punya 3 (row 9). Eliminasi kolom 1, 2, 3!',
                grid: [
                    [0, 0, 0, 2, 6, 0, 7, 0, 1],
                    [6, 8, 0, 0, 7, 0, 0, 9, 0],
                    [1, 9, 0, 0, 0, 4, 5, 0, 0],
                    [8, 2, 0, 1, 0, 0, 0, 4, 0],
                    [0, 0, 4, 6, 0, 2, 9, 0, 0],
                    [0, 5, 0, 0, 0, 3, 0, 2, 8],
                    [0, 0, 9, 3, 0, 0, 0, 7, 4],
                    [0, 4, 0, 0, 5, 0, 0, 3, 6],
                    [7, 0, 3, 0, 1, 8, 0, 0, 0]
                ],
                highlightBox: 0,
                highlightCells: [[8, 2]],
                instruction: 'Angka 3 sudah ada di kotak kiri atas (row 9, col 3)'
            },
            {
                title: 'Hidden Single Ditemukan!',
                explanation: 'Setelah eliminasi, angka 3 hanya bisa di kolom 6 atau 8. Dengan cek lebih lanjut, ternyata hanya kolom 6 yang valid!',
                grid: [
                    [0, 0, 0, 2, 6, 3, 7, 0, 1],
                    [6, 8, 0, 0, 7, 0, 0, 9, 0],
                    [1, 9, 0, 0, 0, 4, 5, 0, 0],
                    [8, 2, 0, 1, 0, 0, 0, 4, 0],
                    [0, 0, 4, 6, 0, 2, 9, 0, 0],
                    [0, 5, 0, 0, 0, 3, 0, 2, 8],
                    [0, 0, 9, 3, 0, 0, 0, 7, 4],
                    [0, 4, 0, 0, 5, 0, 0, 3, 6],
                    [7, 0, 3, 0, 1, 8, 0, 0, 0]
                ],
                highlightCells: [[0, 5]],
                answer: 3,
                instruction: 'Ini adalah HIDDEN SINGLE! Angka 3 "tersembunyi" di kolom 6! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Hidden Single untuk angka 5 di row 3!',
            grid: [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 5, 0, 0, 1],
                [0, 0, 1, 8, 0, 6, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ],
            answerCell: [2, 4],
            answerValue: 5,
            hint: 'Scan row 3 untuk angka 5. Dimana saja 5 bisa ditempatkan?'
        }
    },
    {
        name: 'Pointing Pairs',
        slug: 'pointing-pairs',
        category: 'intermediate',
        difficulty: 4,
        description: 'Menggunakan kandidat di box untuk eliminasi di row/column',
        icon: '👉',
        when_to_use: 'Gunakan ketika kandidat untuk sebuah angka dalam box hanya muncul di satu baris atau kolom.',
        order_index: 3,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Pointing Pairs',
                explanation: 'Pointing Pairs terjadi ketika kandidat untuk sebuah angka di dalam box hanya ada di satu row atau column. Kita bisa mengeliminasi angka tersebut dari row/column di luar box!',
                grid: [
                    [0, 2, 8, 0, 0, 7, 0, 0, 0],
                    [0, 1, 6, 0, 8, 3, 0, 7, 0],
                    [0, 0, 7, 0, 0, 0, 0, 8, 0],
                    [0, 0, 5, 0, 0, 8, 0, 0, 0],
                    [6, 0, 4, 3, 7, 9, 8, 0, 5],
                    [0, 0, 3, 5, 0, 0, 7, 0, 0],
                    [0, 6, 0, 0, 0, 0, 5, 0, 0],
                    [0, 8, 0, 9, 3, 0, 6, 1, 0],
                    [0, 0, 0, 7, 0, 0, 3, 9, 0]
                ],
                instruction: 'Mari kita analisis dimana angka 9 bisa ditempatkan di box kiri-atas'
            },
            {
                title: 'Identifikasi Kandidat dalam Box',
                explanation: 'Dalam box kiri-atas (baris 1-3, kolom 1-3), kita cari sel-sel yang bisa berisi angka 9',
                grid: [
                    [0, 2, 8, 0, 0, 7, 0, 0, 0],
                    [0, 1, 6, 0, 8, 3, 0, 7, 0],
                    [0, 0, 7, 0, 0, 0, 0, 8, 0],
                    [0, 0, 5, 0, 0, 8, 0, 0, 0],
                    [6, 0, 4, 3, 7, 9, 8, 0, 5],
                    [0, 0, 3, 5, 0, 0, 7, 0, 0],
                    [0, 6, 0, 0, 0, 0, 5, 0, 0],
                    [0, 8, 0, 9, 3, 0, 6, 1, 0],
                    [0, 0, 0, 7, 0, 0, 3, 9, 0]
                ],
                highlightBox: 0,
                highlightCells: [[0, 0], [2, 0], [2, 1]],
                instruction: 'Angka 9 hanya bisa di sel [1,1], [3,1], atau [3,2] dalam box ini'
            },
            {
                title: 'Temukan Pola Pointing',
                explanation: 'Perhatikan bahwa semua kandidat 9 dalam box berada di row yang sama atau column yang sama',
                grid: [
                    [0, 2, 8, 0, 0, 7, 0, 0, 0],
                    [0, 1, 6, 0, 8, 3, 0, 7, 0],
                    [0, 0, 7, 0, 0, 0, 0, 8, 0],
                    [0, 0, 5, 0, 0, 8, 0, 0, 0],
                    [6, 0, 4, 3, 7, 9, 8, 0, 5],
                    [0, 0, 3, 5, 0, 0, 7, 0, 0],
                    [0, 6, 0, 0, 0, 0, 5, 0, 0],
                    [0, 8, 0, 9, 3, 0, 6, 1, 0],
                    [0, 0, 0, 7, 0, 0, 3, 9, 0]
                ],
                highlightCells: [[0, 0], [2, 0], [2, 1]],
                highlightCol: 0,
                instruction: 'Dua dari tiga kandidat 9 ada di kolom 1 - ini membentuk Pointing Pair!'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Karena 9 dalam box ini pasti ada di kolom 1, maka 9 tidak mungkin ada di kolom 1 di luar box ini',
                grid: [
                    [0, 2, 8, 0, 0, 7, 0, 0, 0],
                    [0, 1, 6, 0, 8, 3, 0, 7, 0],
                    [0, 0, 7, 0, 0, 0, 0, 8, 0],
                    [0, 0, 5, 0, 0, 8, 0, 0, 0],
                    [6, 0, 4, 3, 7, 9, 8, 0, 5],
                    [0, 0, 3, 5, 0, 0, 7, 0, 0],
                    [0, 6, 0, 0, 0, 0, 5, 0, 0],
                    [0, 8, 0, 9, 3, 0, 6, 1, 0],
                    [0, 0, 0, 7, 0, 0, 3, 9, 0]
                ],
                highlightCol: 0,
                highlightCells: [[3, 0], [5, 0], [6, 0], [8, 0]],
                instruction: 'Eliminasi 9 dari kandidat di kolom 1, baris 4-9 (di luar box)! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Pointing Pair untuk angka 4 di box tengah-kiri!',
            grid: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9],
                [4, 5, 6, 7, 8, 9, 1, 2, 3],
                [7, 8, 9, 1, 2, 3, 4, 5, 6],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            answerCell: [4, 0],
            answerValue: 4,
            hint: 'Lihat dimana angka 4 bisa ditempatkan di box tengah-kiri'
        }
    },
    {
        name: 'Box/Line Reduction',
        slug: 'box-line-reduction',
        category: 'intermediate',
        difficulty: 4,
        description: 'Kebalikan dari Pointing Pairs - menggunakan row/column untuk eliminasi di box',
        icon: '📦',
        when_to_use: 'Gunakan ketika kandidat untuk sebuah angka dalam sebuah baris/kolom hanya muncul di satu box.',
        order_index: 4,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Box/Line Reduction',
                explanation: 'Box/Line Reduction adalah kebalikan dari Pointing Pairs. Ketika kandidat suatu angka di sebuah row/column hanya ada dalam satu box, kita bisa eliminasi angka tersebut dari sel lain dalam box.',
                grid: [
                    [0, 0, 0, 0, 3, 0, 0, 6, 0],
                    [0, 0, 0, 5, 0, 0, 0, 0, 3],
                    [4, 0, 0, 0, 0, 8, 5, 0, 0],
                    [0, 0, 4, 0, 0, 0, 0, 0, 0],
                    [0, 6, 0, 4, 0, 3, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 9, 0, 0],
                    [0, 0, 8, 3, 0, 0, 0, 0, 6],
                    [6, 0, 0, 0, 0, 5, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 0, 0]
                ],
                instruction: 'Mari analisis dimana angka 1 bisa ditempatkan di Row 1'
            },
            {
                title: 'Identifikasi Kandidat di Row',
                explanation: 'Scan Row 1 untuk menemukan sel-sel yang bisa berisi angka 1',
                grid: [
                    [0, 0, 0, 0, 3, 0, 0, 6, 0],
                    [0, 0, 0, 5, 0, 0, 0, 0, 3],
                    [4, 0, 0, 0, 0, 8, 5, 0, 0],
                    [0, 0, 4, 0, 0, 0, 0, 0, 0],
                    [0, 6, 0, 4, 0, 3, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 9, 0, 0],
                    [0, 0, 8, 3, 0, 0, 0, 0, 6],
                    [6, 0, 0, 0, 0, 5, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 0, 0]
                ],
                highlightRow: 0,
                highlightCells: [[0, 0], [0, 1], [0, 2]],
                instruction: 'Di Row 1, angka 1 hanya bisa di kolom 1, 2, atau 3'
            },
            {
                title: 'Semua Kandidat dalam Satu Box',
                explanation: 'Perhatikan bahwa semua kandidat 1 di Row 1 berada dalam box yang sama (box kiri-atas)',
                grid: [
                    [0, 0, 0, 0, 3, 0, 0, 6, 0],
                    [0, 0, 0, 5, 0, 0, 0, 0, 3],
                    [4, 0, 0, 0, 0, 8, 5, 0, 0],
                    [0, 0, 4, 0, 0, 0, 0, 0, 0],
                    [0, 6, 0, 4, 0, 3, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 9, 0, 0],
                    [0, 0, 8, 3, 0, 0, 0, 0, 6],
                    [6, 0, 0, 0, 0, 5, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 0, 0]
                ],
                highlightBox: 0,
                highlightCells: [[0, 0], [0, 1], [0, 2]],
                instruction: 'Semua kandidat 1 di Row 1 ada di box kiri-atas!'
            },
            {
                title: 'Lakukan Eliminasi dalam Box',
                explanation: 'Karena 1 di Row 1 pasti di box ini, maka 1 di box ini pasti di Row 1. Eliminasi 1 dari sel lain di box!',
                grid: [
                    [0, 0, 0, 0, 3, 0, 0, 6, 0],
                    [0, 0, 0, 5, 0, 0, 0, 0, 3],
                    [4, 0, 0, 0, 0, 8, 5, 0, 0],
                    [0, 0, 4, 0, 0, 0, 0, 0, 0],
                    [0, 6, 0, 4, 0, 3, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 9, 0, 0],
                    [0, 0, 8, 3, 0, 0, 0, 0, 6],
                    [6, 0, 0, 0, 0, 5, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 0, 0]
                ],
                highlightBox: 0,
                highlightCells: [[1, 0], [1, 1], [1, 2], [2, 1], [2, 2]],
                instruction: 'Eliminasi 1 dari sel-sel lain di box kiri-atas (Row 2 & 3)! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Box/Line Reduction untuk angka 7 di Row 5!',
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            answerCell: [4, 3],
            answerValue: 7,
            hint: 'Periksa dimana 7 bisa di Row 5 dan lihat box mana yang terpengaruh'
        }
    },
    {
        name: 'Naked Pairs',
        slug: 'naked-pairs',
        category: 'intermediate',
        difficulty: 5,
        description: 'Menemukan dua sel dengan kandidat yang sama untuk eliminasi',
        icon: '👯',
        when_to_use: 'Gunakan ketika dua sel dalam satu unit (baris/kolom/box) memiliki kandidat yang sama persis.',
        order_index: 5,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Naked Pairs',
                explanation: 'Naked Pairs terjadi ketika dua sel dalam satu row, column, atau box memiliki TEPAT DUA kandidat yang SAMA. Kedua angka tersebut bisa dieliminasi dari sel-sel lain di unit yang sama.',
                grid: [
                    [4, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 1, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 7, 0, 0],
                    [0, 0, 0, 0, 5, 0, 0, 0, 0],
                    [0, 1, 0, 0, 6, 0, 0, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0, 3]
                ],
                instruction: 'Mari analisis kandidat di Row 1 untuk menemukan Naked Pair'
            },
            {
                title: 'Identifikasi Kandidat',
                explanation: 'Hitung kandidat untuk setiap sel kosong di Row 1',
                grid: [
                    [4, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 1, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 7, 0, 0],
                    [0, 0, 0, 0, 5, 0, 0, 0, 0],
                    [0, 1, 0, 0, 6, 0, 0, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0, 3]
                ],
                highlightRow: 0,
                highlightCells: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
                instruction: 'Sel kosong di Row 1: kolom 2, 3, 4, 5, 6, 7, 8'
            },
            {
                title: 'Temukan Pasangan',
                explanation: 'Setelah analisis, kita temukan dua sel yang memiliki kandidat identik: {2, 9}',
                grid: [
                    [4, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 1, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 7, 0, 0],
                    [0, 0, 0, 0, 5, 0, 0, 0, 0],
                    [0, 1, 0, 0, 6, 0, 0, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0, 3]
                ],
                highlightCells: [[0, 2], [0, 6]],
                instruction: 'Sel [1,3] dan [1,7] keduanya hanya bisa berisi 2 atau 9!'
            },
            {
                title: 'Logika Naked Pairs',
                explanation: 'Karena sel [1,3] dan [1,7] hanya bisa berisi 2 dan 9, maka salah satu pasti 2 dan yang lain pasti 9.',
                grid: [
                    [4, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 1, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 7, 0, 0],
                    [0, 0, 0, 0, 5, 0, 0, 0, 0],
                    [0, 1, 0, 0, 6, 0, 0, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0, 3]
                ],
                highlightCells: [[0, 2], [0, 6]],
                candidates: [2, 9],
                instruction: 'Naked Pair: {2, 9} - kedua angka ini "diklaim" oleh dua sel ini'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Eliminasi 2 dan 9 dari sel-sel lain di Row 1',
                grid: [
                    [4, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 5, 0, 0, 8, 0, 0, 1, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 7, 0, 0],
                    [0, 0, 0, 0, 5, 0, 0, 0, 0],
                    [0, 1, 0, 0, 6, 0, 0, 4, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0, 3]
                ],
                highlightRow: 0,
                highlightCells: [[0, 1], [0, 3], [0, 4], [0, 5], [0, 7]],
                instruction: 'Eliminasi 2 dan 9 dari semua sel lain di Row 1! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Naked Pair di Column 5!',
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            answerCell: [2, 4],
            answerValue: 3,
            hint: 'Cari dua sel dengan kandidat identik di Column 5'
        }
    },
    {
        name: 'Hidden Pairs',
        slug: 'hidden-pairs',
        category: 'intermediate',
        difficulty: 6,
        description: 'Menemukan dua angka yang hanya muncul di dua sel yang sama',
        icon: '🎭',
        when_to_use: 'Gunakan ketika dua angka hanya muncul sebagai kandidat di dua sel yang sama dalam satu unit.',
        order_index: 6,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Hidden Pairs',
                explanation: 'Hidden Pairs terjadi ketika dua angka hanya bisa ditempatkan di DUA sel yang sama dalam sebuah unit. Berbeda dengan Naked Pairs, sel-sel ini mungkin punya kandidat lain yang "menyembunyikan" pasangan.',
                grid: [
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 5, 9, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 8],
                    [0, 0, 0, 6, 0, 3, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 2, 4, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ],
                instruction: 'Mari analisis Box tengah untuk menemukan Hidden Pair'
            },
            {
                title: 'Hitung Lokasi Setiap Angka',
                explanation: 'Untuk setiap angka 1-9, tentukan di sel mana saja angka tersebut bisa ditempatkan dalam box',
                grid: [
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 5, 9, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 8],
                    [0, 0, 0, 6, 0, 3, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 2, 4, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ],
                highlightBox: 4,
                instruction: 'Box tengah: cari angka yang hanya muncul di 2 sel'
            },
            {
                title: 'Temukan Pasangan Tersembunyi',
                explanation: 'Setelah analisis, angka 2 dan 8 hanya bisa di dua sel yang sama!',
                grid: [
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 5, 9, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 8],
                    [0, 0, 0, 6, 0, 3, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 2, 4, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ],
                highlightCells: [[3, 4], [4, 3]],
                candidates: [2, 8],
                instruction: 'Angka 2 dan 8 hanya bisa di [4,5] dan [5,4] - Hidden Pair!'
            },
            {
                title: 'Mengapa "Hidden"?',
                explanation: 'Sel-sel ini mungkin punya kandidat lain (misal 1, 5, 7), tapi 2 dan 8 "tersembunyi" di antara kandidat tersebut',
                grid: [
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 5, 9, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 8],
                    [0, 0, 0, 6, 0, 3, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 2, 4, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ],
                highlightCells: [[3, 4], [4, 3]],
                instruction: 'Sel ini mungkin punya kandidat {1,2,5,7,8} tapi yang penting: 2 dan 8!'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Karena 2 dan 8 pasti di dua sel ini, eliminasi semua kandidat LAIN dari kedua sel!',
                grid: [
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 5, 9, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 8],
                    [0, 0, 0, 6, 0, 3, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 2, 4, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ],
                highlightCells: [[3, 4], [4, 3]],
                candidates: [2, 8],
                instruction: 'Hapus 1, 5, 7 dari kedua sel! Sekarang mereka hanya punya {2, 8}! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Hidden Pair di Row 3!',
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            answerCell: [2, 3],
            answerValue: 4,
            hint: 'Cari dua angka yang hanya muncul di dua sel yang sama di Row 3'
        }
    },
    {
        name: 'Naked Triples',
        slug: 'naked-triples',
        category: 'intermediate',
        difficulty: 6,
        description: 'Menemukan tiga sel dengan tiga kandidat yang sama untuk eliminasi',
        icon: '🔺',
        when_to_use: 'Gunakan ketika tiga sel dalam satu unit memiliki kandidat yang hanya terdiri dari tiga angka yang sama (tidak harus ketiganya ada di setiap sel).',
        order_index: 7,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Naked Triples',
                explanation: 'Naked Triples adalah perluasan dari Naked Pairs. Tiga sel dalam satu unit yang kandidatnya hanya berisi kombinasi dari 3 angka yang sama. Misalnya: {1,3}, {1,7}, {3,7} membentuk Naked Triple untuk angka 1, 3, 7.',
                grid: [
                    [0, 0, 0, 1, 0, 5, 0, 6, 8],
                    [0, 0, 0, 0, 0, 0, 7, 0, 1],
                    [0, 0, 0, 0, 0, 6, 0, 0, 0],
                    [0, 7, 0, 2, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 0, 9],
                    [0, 0, 0, 0, 0, 1, 0, 3, 0],
                    [0, 0, 0, 6, 0, 0, 0, 0, 0],
                    [8, 0, 7, 0, 0, 0, 0, 0, 0],
                    [1, 5, 0, 3, 0, 7, 0, 0, 0]
                ],
                instruction: 'Mari analisis Row 1 untuk menemukan Naked Triple'
            },
            {
                title: 'Identifikasi Kandidat',
                explanation: 'Hitung kandidat untuk setiap sel kosong di Row 1. Kita mencari 3 sel yang kandidatnya hanya berisi 3 angka yang sama.',
                grid: [
                    [0, 0, 0, 1, 0, 5, 0, 6, 8],
                    [0, 0, 0, 0, 0, 0, 7, 0, 1],
                    [0, 0, 0, 0, 0, 6, 0, 0, 0],
                    [0, 7, 0, 2, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 0, 9],
                    [0, 0, 0, 0, 0, 1, 0, 3, 0],
                    [0, 0, 0, 6, 0, 0, 0, 0, 0],
                    [8, 0, 7, 0, 0, 0, 0, 0, 0],
                    [1, 5, 0, 3, 0, 7, 0, 0, 0]
                ],
                highlightRow: 0,
                highlightCells: [[0, 0], [0, 1], [0, 2], [0, 4], [0, 6]],
                instruction: 'Sel kosong di Row 1: kolom 1, 2, 3, 5, 7'
            },
            {
                title: 'Temukan Tiga Sel',
                explanation: 'Misalnya kita temukan 3 sel dengan kandidat: {2,3}, {2,9}, {3,9}. Ketiganya hanya berisi kombinasi dari angka 2, 3, 9.',
                grid: [
                    [0, 0, 0, 1, 0, 5, 0, 6, 8],
                    [0, 0, 0, 0, 0, 0, 7, 0, 1],
                    [0, 0, 0, 0, 0, 6, 0, 0, 0],
                    [0, 7, 0, 2, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 0, 9],
                    [0, 0, 0, 0, 0, 1, 0, 3, 0],
                    [0, 0, 0, 6, 0, 0, 0, 0, 0],
                    [8, 0, 7, 0, 0, 0, 0, 0, 0],
                    [1, 5, 0, 3, 0, 7, 0, 0, 0]
                ],
                highlightCells: [[0, 0], [0, 2], [0, 4]],
                candidates: [2, 3, 9],
                instruction: 'Tiga sel ini hanya berisi kandidat dari {2, 3, 9} — ini adalah Naked Triple!'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Karena angka 2, 3, 9 pasti menempati ketiga sel ini, eliminasi angka-angka tersebut dari sel lain di Row 1.',
                grid: [
                    [0, 0, 0, 1, 0, 5, 0, 6, 8],
                    [0, 0, 0, 0, 0, 0, 7, 0, 1],
                    [0, 0, 0, 0, 0, 6, 0, 0, 0],
                    [0, 7, 0, 2, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 0, 9],
                    [0, 0, 0, 0, 0, 1, 0, 3, 0],
                    [0, 0, 0, 6, 0, 0, 0, 0, 0],
                    [8, 0, 7, 0, 0, 0, 0, 0, 0],
                    [1, 5, 0, 3, 0, 7, 0, 0, 0]
                ],
                highlightRow: 0,
                highlightCells: [[0, 1], [0, 6]],
                instruction: 'Eliminasi 2, 3, 9 dari sel lain di Row 1! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan Naked Triple di Box tengah!',
            grid: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            answerCell: [4, 4],
            answerValue: 5,
            hint: 'Cari tiga sel yang kandidatnya hanya terdiri dari 3 angka di Box tengah'
        }
    },
    {
        name: 'X-Wing',
        slug: 'x-wing',
        category: 'advanced',
        difficulty: 7,
        description: 'Teknik lanjutan yang menggunakan pola persegi panjang untuk eliminasi kandidat',
        icon: '✈️',
        when_to_use: 'Gunakan ketika sebuah kandidat angka hanya muncul di dua tempat di dua baris berbeda, dan kedua tempat tersebut berada di kolom yang sama (atau sebaliknya).',
        order_index: 8,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan X-Wing',
                explanation: 'X-Wing adalah pola yang terjadi ketika sebuah angka hanya bisa di 2 posisi di masing-masing dari 2 baris, dan posisi-posisi tersebut berada di kolom yang sama. Ini membentuk pola persegi panjang.',
                grid: [
                    [0, 0, 3, 0, 0, 0, 7, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                instruction: 'X-Wing membentuk empat titik persegi panjang. Mari lihat contohnya.'
            },
            {
                title: 'Identifikasi Baris',
                explanation: 'Cari angka yang hanya muncul di 2 posisi di masing-masing baris. Misalnya angka 5 hanya bisa di kolom 2 dan kolom 8 di Baris 1, dan juga hanya bisa di kolom 2 dan kolom 8 di Baris 7.',
                grid: [
                    [0, 0, 3, 0, 0, 0, 7, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 1], [0, 7], [6, 1], [6, 7]],
                instruction: 'Empat sel ini membentuk pola X-Wing — persegi panjang di Baris 1 & 7, Kolom 2 & 8'
            },
            {
                title: 'Logika X-Wing',
                explanation: 'Karena angka tersebut pasti ada di salah satu dari dua posisi di setiap baris, maka di kolom-kolom tersebut angka itu sudah "diklaim" oleh baris-baris X-Wing.',
                grid: [
                    [0, 0, 3, 0, 0, 0, 7, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 1], [0, 7], [6, 1], [6, 7]],
                highlightCol: 1,
                instruction: 'Angka ini pasti ada di Kolom 2 di Baris 1 ATAU Baris 7 — jadi eliminasi dari baris lain!'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Eliminasi kandidat tersebut dari sel-sel lain di kedua kolom (di luar baris X-Wing)',
                grid: [
                    [0, 0, 3, 0, 0, 0, 7, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCol: 1,
                highlightCells: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [7, 1], [8, 1]],
                instruction: 'Eliminasi kandidat dari Kolom 2 (kecuali baris X-Wing)! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan pola X-Wing di grid ini!',
            grid: [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 5, 0, 0, 1],
                [0, 0, 1, 8, 0, 6, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ],
            answerCell: [1, 1],
            answerValue: 4,
            hint: 'Cari angka yang hanya muncul di 2 posisi di dua baris, dengan kolom yang sama'
        }
    },
    {
        name: 'Swordfish',
        slug: 'swordfish',
        category: 'advanced',
        difficulty: 8,
        description: 'Perluasan X-Wing dengan tiga baris dan tiga kolom',
        icon: '🗡️',
        when_to_use: 'Gunakan ketika sebuah kandidat hanya muncul di 2-3 posisi di masing-masing dari 3 baris, dan semua posisi tersebut berada di 3 kolom yang sama (atau sebaliknya).',
        order_index: 9,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan Swordfish',
                explanation: 'Swordfish adalah perluasan dari X-Wing. Alih-alih 2 baris × 2 kolom, Swordfish menggunakan 3 baris × 3 kolom. Sebuah angka yang hanya bisa di 2-3 posisi di 3 baris berbeda, dan posisi-posisi tersebut hanya ada di 3 kolom.',
                grid: [
                    [0, 2, 0, 0, 0, 0, 0, 3, 0],
                    [0, 0, 0, 6, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 9, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0, 0, 9, 0, 0],
                    [3, 0, 0, 0, 5, 0, 0, 0, 7],
                    [0, 0, 6, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 3, 0, 0, 0],
                    [0, 8, 0, 0, 0, 0, 0, 4, 0]
                ],
                instruction: 'Swordfish menggunakan 3 baris dan 3 kolom. Mari lihat polanya.'
            },
            {
                title: 'Identifikasi Tiga Baris',
                explanation: 'Cari angka yang hanya muncul di 2-3 posisi di masing-masing baris. Posisi-posisi ini harus berada di maksimal 3 kolom yang sama.',
                grid: [
                    [0, 2, 0, 0, 0, 0, 0, 3, 0],
                    [0, 0, 0, 6, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 9, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0, 0, 9, 0, 0],
                    [3, 0, 0, 0, 5, 0, 0, 0, 7],
                    [0, 0, 6, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 3, 0, 0, 0],
                    [0, 8, 0, 0, 0, 0, 0, 4, 0]
                ],
                highlightCells: [[0, 0], [0, 2], [4, 2], [4, 5], [8, 0], [8, 5]],
                instruction: 'Contoh: angka di Baris 1 (kol 1,3), Baris 5 (kol 3,6), Baris 9 (kol 1,6) — 3 kolom: 1, 3, 6'
            },
            {
                title: 'Pola Swordfish',
                explanation: 'Ketiga baris "mengunci" angka tersebut di 3 kolom. Angka ini pasti ada di salah satu posisi di setiap baris.',
                grid: [
                    [0, 2, 0, 0, 0, 0, 0, 3, 0],
                    [0, 0, 0, 6, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 9, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0, 0, 9, 0, 0],
                    [3, 0, 0, 0, 5, 0, 0, 0, 7],
                    [0, 0, 6, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 3, 0, 0, 0],
                    [0, 8, 0, 0, 0, 0, 0, 4, 0]
                ],
                highlightCells: [[0, 0], [0, 2], [4, 2], [4, 5], [8, 0], [8, 5]],
                instruction: 'Pola Swordfish terbentuk! Angka ini dikunci di 3 kolom oleh 3 baris.'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Eliminasi kandidat tersebut dari sel-sel lain di ketiga kolom (di luar baris Swordfish)',
                grid: [
                    [0, 2, 0, 0, 0, 0, 0, 3, 0],
                    [0, 0, 0, 6, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 9, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0, 0, 9, 0, 0],
                    [3, 0, 0, 0, 5, 0, 0, 0, 7],
                    [0, 0, 6, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 2, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 3, 0, 0, 0],
                    [0, 8, 0, 0, 0, 0, 0, 4, 0]
                ],
                highlightCells: [[1, 0], [2, 0], [3, 0], [5, 0], [6, 0], [7, 0], [1, 2], [2, 2], [6, 2], [7, 2]],
                instruction: 'Eliminasi kandidat dari Kolom 1, 3, dan 6 (di luar baris Swordfish)! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Identifikasi pola Swordfish di grid ini!',
            grid: [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 5, 0, 0, 1],
                [0, 0, 1, 8, 0, 6, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ],
            answerCell: [4, 1],
            answerValue: 3,
            hint: 'Cari angka yang muncul di 2-3 posisi di 3 baris, dan posisi-posisinya hanya ada di 3 kolom'
        }
    },
    {
        name: 'XY-Wing',
        slug: 'xy-wing',
        category: 'advanced',
        difficulty: 8,
        description: 'Menggunakan tiga sel dengan pasangan kandidat yang saling terhubung',
        icon: '🦅',
        when_to_use: 'Gunakan ketika ada sel pivot dengan kandidat {X,Y} yang terhubung ke dua sel wing: satu dengan {X,Z} dan satu dengan {Y,Z}. Angka Z bisa dieliminasi dari sel yang "melihat" kedua wing.',
        order_index: 10,
        mastery_requirement: 5,
        steps: [
            {
                title: 'Pengenalan XY-Wing',
                explanation: 'XY-Wing melibatkan 3 sel: 1 pivot dan 2 wing. Pivot punya kandidat {X,Y}. Wing pertama punya {X,Z} dan wing kedua punya {Y,Z}. Ketiganya saling terhubung melalui baris, kolom, atau box.',
                grid: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 0, 0, 0, 0],
                    [0, 0, 5, 0, 0, 0, 8, 0, 0],
                    [0, 0, 0, 2, 0, 6, 0, 0, 0],
                    [0, 4, 0, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 8, 0, 7, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                instruction: 'XY-Wing menggunakan pivot dan dua sayap (wing). Mari pelajari polanya.'
            },
            {
                title: 'Identifikasi Pivot',
                explanation: 'Pivot adalah sel dengan tepat 2 kandidat, misalnya {3,7}. Pivot harus "melihat" (se-baris/kolom/box) dua sel wing.',
                grid: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 0, 0, 0, 0],
                    [0, 0, 5, 0, 0, 0, 8, 0, 0],
                    [0, 0, 0, 2, 0, 6, 0, 0, 0],
                    [0, 4, 0, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 8, 0, 7, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                highlightCells: [[4, 4]],
                instruction: 'Sel pivot dengan kandidat {X, Y} — misalnya {3, 7}'
            },
            {
                title: 'Identifikasi Wing',
                explanation: 'Wing pertama punya kandidat {X,Z} (misalnya {3,5}) dan wing kedua punya {Y,Z} (misalnya {7,5}). Perhatikan: Z (angka 5) ada di kedua wing!',
                grid: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 0, 0, 0, 0],
                    [0, 0, 5, 0, 0, 0, 8, 0, 0],
                    [0, 0, 0, 2, 0, 6, 0, 0, 0],
                    [0, 4, 0, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 8, 0, 7, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                highlightCells: [[4, 4], [4, 0], [0, 4]],
                instruction: 'Pivot {3,7}, Wing 1 {3,5}, Wing 2 {7,5} — angka Z = 5 ada di kedua wing'
            },
            {
                title: 'Lakukan Eliminasi',
                explanation: 'Angka Z (5) bisa dieliminasi dari semua sel yang "melihat" kedua wing secara bersamaan. Apapun nilai pivot, salah satu wing pasti berisi Z.',
                grid: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3, 0, 0, 0, 0],
                    [0, 0, 5, 0, 0, 0, 8, 0, 0],
                    [0, 0, 0, 2, 0, 6, 0, 0, 0],
                    [0, 4, 0, 0, 0, 0, 0, 1, 0],
                    [0, 0, 0, 8, 0, 7, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 6, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                highlightCells: [[0, 0]],
                instruction: 'Eliminasi angka Z (5) dari sel yang melihat kedua wing! ✓',
                success: true
            }
        ],
        example_puzzle: {
            question: 'Temukan XY-Wing di grid ini!',
            grid: [
                [0, 0, 3, 0, 2, 0, 6, 0, 0],
                [9, 0, 0, 3, 0, 5, 0, 0, 1],
                [0, 0, 1, 8, 0, 6, 4, 0, 0],
                [0, 0, 8, 1, 0, 2, 9, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 8],
                [0, 0, 6, 7, 0, 8, 2, 0, 0],
                [0, 0, 2, 6, 0, 9, 5, 0, 0],
                [8, 0, 0, 2, 0, 3, 0, 0, 9],
                [0, 0, 5, 0, 1, 0, 3, 0, 0]
            ],
            answerCell: [4, 4],
            answerValue: 4,
            hint: 'Cari sel pivot dengan 2 kandidat yang terhubung ke dua wing'
        }
    }
];

async function seedTechniques() {
    try {
        console.log('Seeding techniques...');

        // Clear existing techniques
        await db.query('DELETE FROM user_technique_mastery');
        await db.query('DELETE FROM techniques');
        console.log('Cleared existing techniques');

        // Insert each technique
        for (const technique of techniques) {
            await db.query(
                `INSERT INTO techniques
                    (name, slug, category, difficulty, description, icon,
                     when_to_use, steps, example_puzzle, mastery_requirement, order_index)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    technique.name,
                    technique.slug,
                    technique.category,
                    technique.difficulty,
                    technique.description,
                    technique.icon,
                    technique.when_to_use,
                    JSON.stringify(technique.steps),
                    JSON.stringify(technique.example_puzzle),
                    technique.mastery_requirement,
                    technique.order_index
                ]
            );
            console.log(`  ✓ Inserted: ${technique.name}`);
        }

        console.log(`\nSuccessfully seeded ${techniques.length} techniques!`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding techniques:', error);
        process.exit(1);
    }
}

seedTechniques();
