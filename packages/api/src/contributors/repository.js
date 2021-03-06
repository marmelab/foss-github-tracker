const signale = require('signale');
const {
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
    FILTER_OPERATOR_IN,
    FILTER_OPERATOR_LP,
    FILTER_OPERATOR_PL,
    FILTER_OPERATOR_PLP,
} = require('../toolbox/sanitizers');

const {
    filtersSanitizer,
    paginationSanitizer,
    sortSanitizer,
} = require('../toolbox/sanitizers');
const { getDbClient } = require('../toolbox/dbConnexion');

const tableName = 'contributors';
const filterableFields = ['id'];
const sortableFields = ['login', 'name', 'id'];

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
        .where({ isActive: true })
        .groupBy(`${tableName}.id`);

    filters.map((filter) => {
        let parsedFilters;
        try {
            parsedFilters = JSON.parse(filter.value);
        } catch (error) {
            parsedFilters = filter.value;
        }

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
            case FILTER_OPERATOR_IN:
                if (parsedFilters) {
                    query.whereIn(filter.name, parsedFilters);
                }
                break;
            case FILTER_OPERATOR_PLP:
                query.andWhere(filter.name, 'LIKE', `%${filter.value}%`);
                break;
            case FILTER_OPERATOR_PL:
                query.andWhere(filter.name, 'LIKE', `%${filter.value}`);
                break;
            case FILTER_OPERATOR_LP:
                query.andWhere(filter.name, 'LIKE', `${filter.value}%`);
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
    const sanitizedSort = sortSanitizer(sort, sortableFields);
    const client = getDbClient();
    const query = getFilteredQuery(
        client,
        filtersSanitizer(filters, filterableFields),
        sanitizedSort
    );
    const { perPage, currentPage } = paginationSanitizer(pagination);

    const list = await query
        .paginate({ perPage, currentPage, isLengthAware: true })
        .then((result) => ({
            contributors: result.data,
            pagination: result.pagination,
        }));

    for (let i = 0; i < list.contributors.length; i++) {
        const projects = list.contributors[i].repositories;
        if (projects && projects.length) {
            const projectData = await client
                .select('*')
                .from('repositories')
                .whereIn('id', projects)
                .andWhere({ decision: 'maintained' });
            list.contributors[i].repositories = projectData;
        }
    }

    return list;
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
        .where({ id, isActive: true })
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
