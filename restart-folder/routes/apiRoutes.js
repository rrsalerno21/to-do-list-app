const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all tasks
router.get('/all', (req, res) => {
    db.Todo.findAll().then(todos => res.json(todos));
});

// Get a specific task



module.exports = router;