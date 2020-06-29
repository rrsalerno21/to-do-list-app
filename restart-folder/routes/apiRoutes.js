const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all tasks
router.get('/all', (req, res) => {
    db.Todo.findAll().then(todos => res.json(todos));
});

// Post a new todo
router.post('/new', (req, res) => {
    db.Todo.create({
        task_header: req.body.task_header,
        task_details: req.body.task_details,
        status: req.body.status,
        folder: req.body.folder
    }).then(submittedTodo => res.send(submittedTodo));
});

// Get a single to do by the id
router.get('/find/:id', (req, res) => {
    db.Todo.findAll({
        where: {
            id: req.params.id
        }
    }).then(todo => res.json(todo));
})



module.exports = router;