const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all tasks
router.get('/all', (req, res) => {
    db.Todo.findAll().then(todos => res.json(todos));
});

// Post a new todo
router.post('/new', (req, res) => {
    console.log(req.body.due_date);
    db.Todo.create({
        task_header: req.body.task_header,
        task_details: req.body.task_details,
        status: req.body.status,
        folder: req.body.folder,
        due_date: req.body.due_date
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

// Update a to do
router.put('/edit', (req, res) => {
    db.Todo.update(
        {
            task_header: req.body.task_header,
            task_details: req.body.task_details,
            status: req.body.status,
            folder: req.body.folder,
            due_date: req.body.due_date
        }, 
        {
            where: {id: req.body.id}
        }
    ).then(()=> res.send('Success'));
});

// Update a to do's status
router.put('/edit-status', (req, res) => {

    db.Todo.update({
        status: req.body.status,
    }, 
    {
        where: {id: req.body.id}
    }).then(() => res.send('Success'));
})

// Delete a task
router.delete('/delete/:id', (req, res) => {
    db.Todo.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send('Destroyed'));
})

// Delete all tasks
router.delete('/delete-all', (req, res) => {
    db.Todo.destroy({
        truncate: true
    }).then(() => res.send('Destroyed All'));
});

module.exports = router;