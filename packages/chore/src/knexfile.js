const config = require('./config');
const knexStringcase = require('knex-stringcase');
const { attachPaginate } = require('knex-paginate');

attachPaginate();
const knexConfig = {
    client: 'pg',
    connection: config.postgres,
    migrations: {
        tableName: 'migrations',
    },
    pool: { min: 0, max: 7 },
};

module.exports = knexConfig;
