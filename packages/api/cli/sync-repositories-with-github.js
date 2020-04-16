const signale = require('signale');

const gitHubClient = require('../src/githubClient');
const {
    convertForSave,
    convertForUpdate,
} = require('../src/publicRepositories/githubRepository');
const { getDbClient } = require('../src/toolbox/dbConnexion');

const pgClient = getDbClient();

const createNewRepository = async (pgClient, data) => {
    try {
        await pgClient('repositories').insert(data);
    } catch (error) {
        signale.error('Error with repo. creation: ', error.message);
    }
};
const updateRepository = async (pgClient, id, data) => {
    try {
        await pgClient('repositories').update(data).where({ id });
    } catch (error) {
        signale.error('Error with repo. update: ', error.message);
    }
};

const githubRepositoriesSynchronization = async () => {
    signale.info('Ok Github: start repositories synchronization');
    const repositories = await pgClient('repositories').select(
        'id',
        'githubId',
        'name'
    );
    let newRepo = 0;
    await gitHubClient.repos
        .listForOrg({
            org: 'marmelab',
            type: 'public',
            per_page: 100,
            sort: 'created_at',
        })
        .then((ghResponse) => {
            ghResponse.data.map(async (repo) => {
                const existingRepo = repositories.find(
                    (r) => r.githubId === repo.node_id
                );
                if (!existingRepo) {
                    await createNewRepository(pgClient, convertForSave(repo));
                    newRepo++;
                } else {
                    await updateRepository(
                        pgClient,
                        existingRepo.id,
                        convertForUpdate(repo)
                    );
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
                    await createNewRepository(pgClient, convertForSave(repo));
                    newRepo++;
                } else {
                    await updateRepository(
                        pgClient,
                        existingRepo.id,
                        convertForSave(repo)
                    );
                }
            });
        });
    if (newRepo) {
        signale.info(`${newRepo} new repository have been created.`);
    } else {
        signale.info('All repositories was present in database');
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
