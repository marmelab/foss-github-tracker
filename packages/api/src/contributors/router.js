const Router = require('koa-router');

const {
    formatPaginationToLinkHeader,
    prepareQueryParametersForList,
} = require('../toolbox/sanitizers');
const {
    deleteOne,
    getOne,
    getPaginatedList,
    updateOne,
} = require('./repository');

const router = new Router({
    prefix: '/api/contributors',
});

router.get('/', async (ctx) => {
    const { contributors, pagination } = await getPaginatedList(
        prepareQueryParametersForList(ctx.query)
    );

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/contributors',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = contributors;
});

router.get('/:contributorId', async (ctx) => {
    const contributor = await getOne(ctx.params.contributorId);

    if (!contributor) {
        const explainedError = new Error(
            `The contributor of id ${ctx.params.contributorId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (contributor.error) {
        const explainedError = new Error(contributor.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = contributor;
});

router.delete('/:contributorId', async (ctx) => {
    const deletedUser = await deleteOne(ctx.params.contributorId);

    if (deletedUser.error) {
        const explainedError = new Error(deletedUser.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    if (!deletedUser.id) {
        const explainedError = new Error(
            `The contributor of id ${ctx.params.contributorId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    ctx.body = {
        message: `contributor ${deletedUser.id} has been deleted`,
    };
});

router.put('/:contributorId', async (ctx) => {
    const updatedContributor = await updateOne(
        ctx.params.contributorId,
        ctx.request.body
    );

    if (!updatedContributor) {
        const explainedError = new Error(
            `The contributor of id ${ctx.params.contributorId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (updatedContributor.error) {
        const explainedError = new Error(updatedContributor.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = updatedContributor;
});

module.exports = router;
