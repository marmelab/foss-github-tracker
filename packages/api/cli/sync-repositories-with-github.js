const signale = require('signale');

const gitHubClient = require('../src/githubClient');
const {
    convertForSave,
    convertForUpdate,
} = require('../src/publicRepositories/githubRepository');
const { getDbClient } = require('../src/toolbox/dbConnexion');

const pgClient = getDbClient();

const githubRepositoriesSynchronization = async () => {
    signale.info('Ok Github: start repositories synchronization');
    const repositories = await pgClient('repositories').select(
        'id',
        'githubId',
        'name'
    );
    let newRepo = [];
    let maintainedRepo = [];
    await gitHubClient.repos
        .listForOrg({
            org: 'marmelab',
            type: 'public',
            per_page: 100,
            sort: 'created_at',
        })
        .then((ghResponse) => {
            ghResponse.data.map((repo) => {
                const existingRepo = repositories.find(
                    (r) => r.githubId === repo.node_id
                );
                if (!existingRepo) {
                    newRepo.push(convertForSave(repo));
                } else {
                    maintainedRepo.push(convertForUpdate(repo, existingRepo));
                }
            });
        });
    await gitHubClient.repos
        .listForOrg({
            org: 'marmelab',
            type: 'public',
            per_page: 100,
            sort: 'created_at',
            page: 2,
        })
        .then((ghResponse) => {
            ghResponse.data.map(async (repo) => {
                const existingRepo = repositories.find(
                    (r) => r.githubId === repo.node_id
                );
                if (!existingRepo) {
                    newRepo.push(convertForSave(repo));
                } else {
                    maintainedRepo.push(convertForUpdate(repo, existingRepo));
                }
            });
        });

    if (newRepo.length) {
        await pgClient.batchInsert('repositories', newRepo);
        signale.info(`${newRepo.length} new repository have been created.`);
    } else {
        signale.info('All repositories was present in database');
    }

    if (maintainedRepo.length) {
        const updates = maintainedRepo.map((repo) =>
            pgClient
                .update(repo)
                .from('repositories')
                .where({ githubId: repo.githubId })
        );
        await Promise.all(updates);
        signale.info(`${maintainedRepo.length} repositories have been update.`);
    }

    return 'ok';
};

githubRepositoriesSynchronization()
    .then(() => {
        signale.info('End of Github synchronization');
        process.exit(0);
    })
    .catch((error) => {
        signale.error('Error during Github call: ', error);
        process.exit(1);
    });
