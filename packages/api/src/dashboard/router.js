const Router = require('koa-router');

const { getDbClient } = require('../toolbox/dbConnexion');
const {
    MAINTAINED,
    decisions,
    NONE,
} = require('../publicRepositories/publicRepository');

const router = new Router({
    prefix: '/api/dashboard',
});

const getLicenses = (client) =>
    client('repositories').select('license').groupBy('license');

const getLanguages = (client) =>
    client('repositories').select('primaryLanguage').groupBy('primaryLanguage');

router.get('/languages', async (ctx) => {
    const languages = await getLanguages(getDbClient());

    ctx.body = languages;
});

router.get('/licenses', async (ctx) => {
    const licenses = await getLicenses(getDbClient());

    ctx.body = licenses;
});

router.get('/', async (ctx) => {
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
                    [license.license]: {
                        total: 0,
                        byDecision: { ...decisionsContainer },
                    },
                }),
                { total: licenses.length }
            ),
            languages: languages.reduce(
                (acc, language) => ({
                    ...acc,
                    [language.primaryLanguage]: {
                        total: 0,
                        byDecision: { ...decisionsContainer },
                    },
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
        if (!repo.maintainerids.length) {
            warnings.push(
                'A maintained repository must have at least one maintainer.'
            );
        }

        return warnings.length ? warnings : false;
    };

    repositories.map((repo) => {
        dashboard.statistics.decisions[repo.decision]++;
        dashboard.statistics.licenses[repo.license].total++;
        dashboard.statistics.licenses[repo.license].byDecision[repo.decision]++;
        dashboard.statistics.languages[repo.primaryLanguage].total++;
        dashboard.statistics.languages[repo.primaryLanguage].byDecision[
            repo.decision
        ]++;
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
                dashboard.maintainedRepositoriesWarning.push({
                    ...repo,
                    warnings,
                });
            }
        } else {
            if (hasNoDecision(repo)) {
                dashboard.repositoriesWithoutDecisions.push(repo);
            }
            if (!repo.isArchived) {
                dashboard.unMaintainedRepositoriesUnArchived.push(repo);
            }
        }
    });

    ctx.set('X-Total-Count', dashboard.statistics.total);
    ctx.body = dashboard;
});

module.exports = router;
