const { NONE } = require('./repository');

const convertForSave = (githubRepo) => ({
    githubId: githubRepo.node_id,
    name: githubRepo.name,
    description: githubRepo.description || 'no description',
    primaryLanguage: githubRepo.language || 'none',
    languages: 0,
    license: githubRepo.license ? githubRepo.license.name : 'none',
    url: githubRepo.url,
    homepage: githubRepo.homepage || 'none',
    starsNumber: githubRepo.stargazers_count || 0,
    forkNumber: githubRepo.forks_count || 0,
    openIssuesNumber: githubRepo.open_issues || 0,
    openPullRequestsNumber: 0,
    watchersNumber: githubRepo.watchers,
    isArchived: githubRepo.archived,
    isDisabled: githubRepo.disabled,
    isLocked: githubRepo.locked || false,
    createdAt: githubRepo.created_at,
    pushedAt: githubRepo.pushed_at,
    updatedAt: githubRepo.updated_at,
    decision: NONE,
});

const convertForUpdate = (githubRepo) => ({
    description: githubRepo.description || 'no description',
    license: githubRepo.license ? githubRepo.license.name : 'none',
    homepage: githubRepo.homepage || 'none',
    starsNumber: githubRepo.stargazers_count || 0,
    forkNumber: githubRepo.forks_count || 0,
    openIssuesNumber: githubRepo.open_issues || 0,
    watchersNumber: githubRepo.watchers,
    isArchived: githubRepo.archived,
    isDisabled: githubRepo.disabled,
    pushedAt: githubRepo.pushed_at,
    updatedAt: githubRepo.updated_at,
});

module.exports = {
    convertForSave,
    convertForUpdate,
};
