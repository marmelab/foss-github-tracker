const knex = require('knex');
const knexConfig = require('../knexfile');

let dbClient;
module.exports = {
    getDbClient: function () {
        if (dbClient) return dbClient;
        dbClient = knex(knexConfig);
        return dbClient;
    },
};
