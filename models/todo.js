module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        task_header: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'At least add a task header!'
                }
            }
        },
        task_details: {
            type: DataTypes.STRING,
            validate: {
                notContains: {
                    args: ['<script>', '</script>'],
                    msg: 'Nice try'
                }
            }
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        folder: {
            type: DataTypes.STRING,
            defaultValue: 'Standard',
        },
        due_date: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: 'Please use a valid date (YYYY/MM/DD)'
                }
            }
        }
    }, {
        freezeTableName: true
    });
    return Todo;
}