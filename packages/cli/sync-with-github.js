const knex = require('knex');
const signale = require('signale');

const octokit = require('../chore/src/githubClient');
const knexConfig = require('../chore/src/knexfile');
const {
    convertForSave,
    convertForUpdate,
} = require('../chore/src/repositories/githubRepository');
const {
    convertForSave: convertContributorForSave,
} = require('../chore/src/contributors/githubContributor');

const pg = knex(knexConfig);

const createNewRepository = async (pg, data) => {
    try {
        await pg('repositories').insert(data);
    } catch (error) {
        signale.error('Error with repo. creation: ', error.message);
    }
};
const updateRepository = async (pg, id, data) => {
    try {
        await pg('repositories').update(data).where({ id });
    } catch (error) {
        signale.error('Error with repo. update: ', error.message);
    }
};

const githubRepositoriesSynchronization = async () => {
    signale.info('Ok Github: start repositories synchronization');
    const repositories = await pg('repositories').select(
        'id',
        'githubId',
        'name'
    );
    let newRepo = 0;
    await octokit.repos
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
                    await createNewRepository(pg, convertForSave(repo));
                    newRepo++;
                } else {
                    await updateRepository(
                        pg,
                        existingRepo.id,
                        convertForUpdate(repo)
                    );
                }
            });
        });
    await octokit.repos
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
                    await createNewRepository(pg, convertForSave(repo));
                    newRepo++;
                } else {
                    await updateRepository(
                        pg,
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

const createNewContributor = async (pg, data) => {
    try {
        await pg('contributors').insert(data);
    } catch (error) {
        signale.error('Error with Contributor creation: ', error.message);
    }
};
const githubContributorsSynchronization = async () => {
    signale.info('Ok Github: start contributors synchronization');
    const contributors = await pg('contributors').select(
        'id',
        'githubId',
        'name'
    );
    let newContributors = 0;
    await octokit.orgs.listMembers({ org: 'marmelab' }).then((ghResponse) => {
        ghResponse.data.map(async (contributor) => {
            const existingContributor = contributors.find(
                (ct) => ct.githubId === contributor.node_id
            );
            if (!existingContributor) {
                const data = convertContributorForSave(contributor);
                await createNewContributor(pg, data);
            }
        });
    });
    if (newContributors) {
        signale.info(`${newContributors} new contributors have been created.`);
    } else {
        signale.info("All Marmelab's contributors was already in database");
    }

    return 'ok';
};

githubRepositoriesSynchronization()
    .then(githubContributorsSynchronization)
    .then(() => {
        signale.info('End of Github synchronization');
        process.exit(0);
    })
    .catch((error) => {
        signale.error('Error during Github call: ', error);
        process.exit(1);
    });
