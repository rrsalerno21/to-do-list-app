const express = require('express');
const router = express.Router();
const db = require('../models');

// Root
router.get('/', (req, res) => {
    db.Todo.findAll().then(todos => {
        res.render('index', todos);
    });
})

module.exports = router;