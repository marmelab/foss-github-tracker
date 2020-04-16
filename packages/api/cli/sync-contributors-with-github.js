const signale = require('signale');

const gitHubClient = require('../src/githubClient');
const { convertForSave } = require('../src/contributors/githubContributor');
const { getDbClient } = require('../src/toolbox/dbConnexion');

const pgClient = getDbClient();

const createNewContributor = async (pgClient, data) => {
    try {
        await pgClient('contributors').insert(data);
    } catch (error) {
        signale.error('Error with Contributor creation: ', error.message);
    }
};
const githubContributorsSynchronization = async () => {
    signale.info('Ok Github: start contributors synchronization');
    const contributors = await pgClient('contributors').select(
        'id',
        'githubId',
        'name'
    );
    let newContributors = [];
    await gitHubClient.orgs
        .listMembers({ org: 'marmelab' })
        .then((ghResponse) => {
            ghResponse.data.map((contributor) => {
                const existingContributor = contributors.find(
                    (ct) => ct.githubId === contributor.node_id
                );
                if (!existingContributor) {
                    const data = convertForSave(contributor);
                    newContributors.push(createNewContributor(pgClient, data));
                }
            });
        });
    if (newContributors.length) {
        signale.info(
            `${newContributors.length} new contributors have been created.`
        );
        await Promise.all(newContributors);
    } else {
        signale.info("All Marmelab's contributors was already in database");
    }

    return 'ok';
};

githubContributorsSynchronization()
    .then(() => {
        signale.info('End of Github synchronization');
        process.exit(0);
    })
    .catch((error) => {
        signale.error('Error during Github call: ', error);
        process.exit(1);
    });
