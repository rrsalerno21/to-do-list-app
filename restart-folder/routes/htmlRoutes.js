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
        // Make todos into a JSON object
        let todosAsJSON = Serializer.serializeMany(todos, db.Todo, scheme);
        console.log(todosAsJSON);

        // get completed task count
        let completedCount = 0;
        for (task of todosAsJSON) {
            if (task.status) {
                completedCount ++;
            }
        };

        res.render('index', {
            todos: todosAsJSON,
            activeCount: todosAsJSON.length - completedCount,
            completedCount: completedCount
        })
    });
});


module.exports = router;