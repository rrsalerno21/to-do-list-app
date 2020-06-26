const mysql = require('mysql');
const config = require('../private/config');
const util = require('util');

function makeDb() {
    const connection = mysql.createConnection(config);

    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end)
                .call(connection);
        }
    }
};

const db = makeDb();

module.exports = db;