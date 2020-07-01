const express = require('express');
const router = express.Router();
const db = require('../models');
const Serializer = require('sequelize-to-json');

// Root to get all data needed to render
router.get('/', (req, res) => {
    db.Todo.findAll().then(todos => {
        // Make todos into a JSON object
        let todosAsJSON = Serializer.serializeMany(todos, db.Todo, {include: ['@all']});
        
        // get completed task count and add formated date key to each task
        let completedCount = 0;
        for (task of todosAsJSON) {
            if (task.status) {
                completedCount ++;
            }
            let splitTime = task.due_date.split('T')[0]
            let formatTime = splitTime.split('-');
            let 
            month = formatTime[1],
            date = formatTime[2];
            task.formatedDate = `${month}/${date}`;
        };
        console.log(todosAsJSON);
        
        
        

        res.render('index', {
            todos: todosAsJSON,
            activeCount: todosAsJSON.length - completedCount,
            completedCount: completedCount
        })
    });
});


module.exports = router;