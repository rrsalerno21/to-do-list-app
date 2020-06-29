const orm = require('../config/orm');

const task = {
    viewAll: async function() {
        return await orm.all('tasks');
    }
}