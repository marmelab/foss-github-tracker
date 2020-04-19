const Router = require('koa-router');

const {
    formatPaginationToLinkHeader,
    prepareQueryParametersForList,
} = require('../toolbox/sanitizers');
const { getOne, getPaginatedList, updateOne } = require('./repository');

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

router.put('/:id', async (ctx) => {
    const updatedRepository = await updateOne(ctx.params.id, ctx.request.body);

    if (!updatedRepository) {
        const explainedError = new Error(
            `The repository of id ${ctx.params.repositortId} does not exist.`
        );
        explainedError.status = 404;

        throw explainedError;
    }

    if (updatedRepository.error) {
        const explainedError = new Error(updatedRepository.error.message);
        explainedError.status = 400;

        throw explainedError;
    }

    ctx.body = updatedRepository;
});

module.exports = router;
