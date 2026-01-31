const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Get techniques - TODO' });
});

router.get('/:id', (req, res) => {
    res.json({ message: 'Get technique - TODO' });
});

module.exports = router;
