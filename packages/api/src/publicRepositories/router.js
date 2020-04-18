const Router = require('koa-router');

const {
    formatPaginationToLinkHeader,
    prepareQueryParametersForList,
} = require('../toolbox/sanitizers');
const { getOne, getPaginatedList } = require('./repository');

const router = new Router({
    prefix: '/api/repositories',
});

router.get('/', async (ctx) => {
    const { repositories, pagination } = await getPaginatedList(
        prepareQueryParametersForList(ctx.query)
    );

    const linkHeaderValue = formatPaginationToLinkHeader({
        resourceURI: '/api/repositories',
        pagination,
    });

    ctx.set('X-Total-Count', pagination.total);
    if (linkHeaderValue) {
        ctx.set('Link', linkHeaderValue);
    }
    ctx.body = repositories;
});

router.get('/:repositortId', async (ctx) => {
    const repository = await getOne(ctx.params.repositortId);

    if (!repository) {
        const explainedError = new Error(
            `The repository of id ${ctx.params.repositortId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (repository.error) {
        const explainedError = new Error(repository.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = repository;
});

module.exports = router;
