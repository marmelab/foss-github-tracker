const Router = require('koa-router');

const { getDbClient } = require('../toolbox/dbConnexion');
const {
    MAINTAINED,
    decisions,
    NONE,
} = require('../publicRepositories/publicRepository');

const getLicenses = (client) =>
    client('repositories').select('license').groupBy('license');

const getLanguages = (client) =>
    client('repositories').select('primaryLanguage').groupBy('primaryLanguage');

const dashboardRouter = new Router({
    prefix: '/api/dashboard',
});

dashboardRouter.get('/', async (ctx) => {
    const client = getDbClient();
    const [
        repositories,
        contributors,
        licenses,
        languages,
    ] = await Promise.all([
        client
            .select(
                `repositories.*`,
                client.raw(
                    'ARRAY_AGG(repository_maintainer.contributor_id) as maintainerIds'
                )
            )
            .from('repositories')
            .leftOuterJoin(
                'repository_maintainer',
                `repositories.id`,
                'repository_maintainer.repository_id'
            )
            .groupBy(`repositories.id`),
        client
            .select(
                `contributors.*`,
                client.raw(
                    'ARRAY_AGG(repository_maintainer.repository_id) as repositories'
                )
            )
            .from('contributors')
            .leftOuterJoin(
                'repository_maintainer',
                `contributors.id`,
                'repository_maintainer.contributor_id'
            )
            .groupBy(`contributors.id`),
        getLicenses(client),
        getLanguages(client),
    ]);

    const decisionsContainer = decisions.reduce(
        (acc, decision) => ({
            ...acc,
            [decision.name]: 0,
        }),
        {}
    );

    const dashboard = {
        maintainedRepositories: [],
        maintainedRepositoriesWarning: [],
        unMaintainedRepositoriesUnArchived: [],
        repositoriesWithoutDecisions: [],
        statistics: {
            total: repositories.length,
            decisions: { ...decisionsContainer },
            licenses: licenses.reduce(
                (acc, license) => ({
                    ...acc,
                    [license.license]: 0,
                }),
                { total: licenses.length }
            ),
            languages: languages.reduce(
                (acc, language) => ({
                    ...acc,
                    [language.primaryLanguage]: 0,
                }),
                { total: languages.length }
            ),
        },
    };

    const isMaintainedRepository = (repo) => repo.decision === MAINTAINED;
    const hasNoDecision = (repo) => repo.decision === NONE;
    const getMaintainedRepositoryWarnings = (repo) => {
        const warnings = [];
        if (!repo.license || repo.license === 'none') {
            warnings.push('A maintained repository must have a license.');
        }
        if (!repo.description || repo.description.trim() === '') {
            warnings.push('A maintained repository must have a description.');
        }
        if (repo.homepage === 'none') {
            warnings.push('A maintained repository should have a homepage.');
        }
        if (!repo.maintainerids.length || !repo.maintainerids[0]) {
            warnings.push(
                'A maintained repository must have at least one maintainer.'
            );
        }

        return warnings.length ? warnings : false;
    };

    repositories.map((repo) => {
        dashboard.statistics.decisions[repo.decision]++;
        dashboard.statistics.licenses[repo.license]++;
        dashboard.statistics.languages[repo.primaryLanguage]++;
        if (isMaintainedRepository(repo)) {
            const warnings = getMaintainedRepositoryWarnings(repo);
            dashboard.maintainedRepositories.push({
                ...repo,
                maintainers: repo.maintainerids.map((id) =>
                    contributors.find((contributor) => contributor.id === id)
                ),
                warnings,
            });
            if (warnings) {
                dashboard.maintainedRepositoriesWarning.push(repo.id);
            }
        } else {
            if (hasNoDecision(repo)) {
                dashboard.repositoriesWithoutDecisions.push(repo.id);
            }
            if (!repo.isArchived) {
                dashboard.unMaintainedRepositoriesUnArchived.push(repo.id);
            }
        }
    });

    ctx.set('X-Total-Count', dashboard.statistics.total);
    ctx.body = dashboard;
});

const languageRouter = new Router({
    prefix: '/api/languages',
});
languageRouter.get('/', async (ctx) => {
    const languages = await getLanguages(getDbClient());

    ctx.set('X-Total-Count', languages.length);
    ctx.body = languages.map((language) => ({
        id: language.primaryLanguage,
        name: language.primaryLanguage,
    }));
});

const licenseRouter = new Router({
    prefix: '/api/licenses',
});
licenseRouter.get('/', async (ctx) => {
    const licenses = await getLicenses(getDbClient());

    ctx.set('X-Total-Count', licenses.length);
    ctx.body = licenses.map((license) => ({
        id: license.license,
        name: license.license,
    }));
});

module.exports = {
    dashboardRouter,
    languageRouter,
    licenseRouter,
};
