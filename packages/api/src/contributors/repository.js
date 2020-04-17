const signale = require('signale');
const {
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
} = require('../toolbox/sanitizers');

const {
    filtersSanitizer,
    paginationSanitizer,
    sortSanitizer,
} = require('../toolbox/sanitizers');
const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'contributors';
const filterableFields = [];
const sortableFields = ['login', 'name'];

/**
 * Knex query for filtrated list
 *
 * @param {object} client - The Database client
 * @param {Array} filters - an array of sanitized filter objets
 * @param {Object} sort - sanitized sort parameters { orderBy, sortBy }
 * @returns {Promise} - Knew query for filtrated list
 */
const getFilteredQuery = (client, filters, sort) => {
    const query = client
        .select(
            `${tableName}.*`,
            client.raw(
                'ARRAY_AGG(repository_maintainer.repository_id) as repositories'
            )
        )
        .from(tableName)
        .leftOuterJoin(
            'repository_maintainer',
            `${tableName}.id`,
            'repository_maintainer.contributor_id'
        )
        .groupBy(`${tableName}.id`);

    filters.map((filter) => {
        switch (filter.operator) {
            case FILTER_OPERATOR_EQ:
                query.andWhere(filter.name, '=', filter.value);
                break;
            case FILTER_OPERATOR_LT:
                query.andWhere(filter.name, '<', filter.value);
                break;
            case FILTER_OPERATOR_LTE:
                query.andWhere(filter.name, '<=', filter.value);
                break;
            case FILTER_OPERATOR_GT:
                query.andWhere(filter.name, '>', filter.value);
                break;
            case FILTER_OPERATOR_GTE:
                query.andWhere(filter.name, '>=', filter.value);
                break;
            default:
                signale.log(
                    `The filter operator ${filter.operator} is not managed`
                );
        }
    });

    if (sort && Object.keys(sort).length) {
        query.orderBy(sort.sortBy, sort.orderBy);
    }

    return query;
};

/**
 * Return paginated and filtered list
 *
 * @param {Array} filters - An array of Filters
 * @param {object} sort - Sort parameters {sortBy, orderBy}
 * @param {object} pagination - Pagination { currentPage, perPage }
 * @returns {Promise} - paginated object with paginated list and totalCount
 */
const getPaginatedList = async ({ filters, sort, pagination }) => {
    const query = getFilteredQuery(
        getDbClient(),
        filtersSanitizer(filters, filterableFields),
        sortSanitizer(sort, sortableFields)
    );
    const { perPage, currentPage } = paginationSanitizer(pagination);

    return query
        .paginate({ perPage, currentPage, isLengthAware: true })
        .then((result) => ({
            contributors: result.data,
            pagination: result.pagination,
        }));
};

/**
 * Return paginated and filtered list
 *
 * @param {String} id - the object identifier
 * @returns {Promise} - an object id present in db, an empty object if not and an object with error props on error
 */
const getOne = async (id) => {
    const client = getDbClient();
    return client
        .first(
            `${tableName}.*`,
            client.raw(
                'ARRAY_AGG(repository_maintainer.repository_id) as repositories'
            )
        )
        .from(tableName)
        .leftOuterJoin(
            'repository_maintainer',
            `${tableName}.id`,
            'repository_maintainer.contributor_id'
        )
        .groupBy(`${tableName}.id`)
        .where({ id })
        .catch((error) => ({ error }));
};

const deleteOne = (id) => {
    const client = getDbClient();
    return client(tableName)
        .where({ id })
        .del()
        .then((nbDeletion) => {
            return nbDeletion ? { id } : {};
        })
        .catch((error) => ({ error }));
};

const updateOne = async (id, data) => {
    const client = getDbClient();
    return client(tableName)
        .update(data)
        .where({ id })
        .then(() => getOne(id))
        .catch((error) => ({ error }));
};

module.exports = {
    deleteOne,
    getOne,
    getPaginatedList,
    updateOne,
};
