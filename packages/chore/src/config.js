const convict = require('convict');

const config = convict({
    env: {
        doc: 'Application environment.',
        format: ['production', 'development', 'test'],
        default: '',
        env: 'NODE_ENV',
    },
    github: {
        token: {
            doc: 'Token for Github API calls',
            format: String,
            default: 'xxxx',
            env: 'GITHUB_TOKEN',
        },
    },
    postgres: {
        host: {
            doc: 'Database host name/IP',
            format: '*',
            default: 'localhost',
            env: 'POSTGRES_HOST',
        },
        port: {
            doc: 'Database port',
            format: 'port',
            default: 5432,
            env: 'POSTGRES_PORT',
        },
        database: {
            doc: 'Database name',
            format: String,
            default: 'foss_analyse',
            env: 'POSTGRES_DB',
        },
        user: {
            doc: 'Database user',
            format: String,
            default: 'alexisjanvier',
            env: 'POSTGRES_USER',
        },
        password: {
            doc: 'Database password',
            format: String,
            default: 'alexisjanvier',
            env: 'POSTGRES_PASSWORD',
        },
    },
});

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
