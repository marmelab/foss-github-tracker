const convertForSave = (githubContributor) => ({
    githubId: githubContributor.node_id,
    avatarUrl: githubContributor.avatar_url,
    email: githubContributor.email || null,
    login: githubContributor.login || 'none',
    name: githubContributor.name || githubContributor.login,
    createdAt: new Date(),
    updatedAt: new Date(),
});

module.exports = {
    convertForSave,
};
