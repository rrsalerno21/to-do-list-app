const express = require('express');
const router = express.Router();
const db = require('../models');
const Serializer = require('sequelize-to-json');

const scheme = {
    include: ['@all']
}

// Root to get all data needed to render
router.get('/', (req, res) => {
    db.Todo.findAll().then(todos => {
        let todosAsJSON = Serializer.serializeMany(todos, db.Todo, scheme);
        console.log(todosAsJSON);
        res.render('index', {todos: todosAsJSON})
    });
});


module.exports = router;