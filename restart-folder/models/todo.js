module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        task_header: {
            type: DataTypes.STRING
        },
        task_details: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        folder: {
            type: DataTypes.STRING,
            defaultValue: 'Standard',
        }
    }, {
        freezeTableName: true
    });
    return Todo;
}