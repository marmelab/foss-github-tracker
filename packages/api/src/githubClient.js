const { Octokit } = require('@octokit/rest');

const config = require('./config');

const getGithubClient = () =>
    new Octokit({
        auth: config.github.token,
    });

module.exports = getGithubClient();
