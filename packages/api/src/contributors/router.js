const Router = require('koa-router');

const {
    formatPaginationToLinkHeader,
    prepareQueryParametersForList,
} = require('../toolbox/sanitizers');
const { getOne, getPaginatedList } = require('./repository');

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
    // const deletedJobPosting = await deleteJobPosting({
    //     client: ctx.db,
    //     jobPostingId: ctx.params.jobPostingId,
    // });

    // if (deletedJobPosting.error) {
    //     const explainedError = new Error(deletedJobPosting.error.message);
    //     explainedError.status = 400;

    //     throw explainedError;
    // }

    // if (!deletedJobPosting.id) {
    //     const explainedError = new Error(
    //         `The jobPosting of id ${ctx.params.jobPostingId} does not exist.`
    //     );
    //     explainedError.status = 404;

    //     throw explainedError;
    // }

    // ctx.body = deletedJobPosting;
    ctx.body = 'DELETE contribubutor';
});

router.put('/:contributorId', async (ctx) => {
    // const updatedJobPosting = await updateJobPosting({
    //     client: ctx.db,
    //     jobPostingId: ctx.params.jobPostingId,
    //     apiData: ctx.request.body,
    // });

    // if (updatedJobPosting.error) {
    //     const explainedError = new Error(updatedJobPosting.error.message);
    //     explainedError.status = 400;

    //     throw explainedError;
    // }

    // if (!updatedJobPosting.id) {
    //     const explainedError = new Error(
    //         `The jobPosting of id ${ctx.params.jobPostingId} does not exist, so it could not be updated`
    //     );
    //     explainedError.status = 404;

    //     throw explainedError;
    // }

    // ctx.body = updatedJobPosting;
    ctx.body = 'UPDATE contribubutor';
});

module.exports = router;
