const db = require('./connection');

const orm = {
    all: async function(table) {
        try {
            const result = await db.query(`SELECT * FROM ${table}`)
            return result;
        } catch (error) {
            throw error;
        }
    },
    selectWhere: async function(table, condition) {
        try {
            const result = await db.query(`SELECT * FROM ${table} WHERE ${condition}`)
            return result;
        } catch (error) {
            throw error;
        }
    },
    create: async function(table, cols, vals) {
        try {
            const result = await db.query(`INSERT INTO ${table} (${cols}) VALUES (${vals})`);
            return result;
        } catch (error) {
            throw error;
        }
    },
    update: async function(table, objColVal, condition) {
        try {
            const result = await db.query(`UPDATE ${table} SET ${objColVal} WHERE (${condition})`);
            return result;
        } catch (error) {
            throw error;
        }
    },
    delete: async function(table, condition) {
        try {
            const result = await db.query(`DELETE FROM ${table} WHERE (${condition})`);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orm;