const querystring = require('querystring');

const prepareQueryParametersForList = ({
    sortBy,
    orderBy,
    currentPage,
    perPage,
    ...filters
} = {}) => ({
    filters,
    sort: sortBy ? { sortBy, orderBy: orderBy || 'ASC' } : null,
    pagination: {
        currentPage: currentPage || 1,
        perPage: perPage || 25,
    },
});

/**
| operateur | applicable à         | explication                 |
| --------- | -------------------- | --------------------------- |
| :eq       | string, number, date | Is equal to                 |
| :gt       | number, date         | Is greater than             |
| :lt       | number, date         | Is less than                |
| :gte      | number, date         | Is greater than or equal to |
| :lte      | number, date         | Is less than or equal to    |
*/
const FILTER_OPERATOR_EQ = 'eq';
const FILTER_OPERATOR_GT = 'gt';
const FILTER_OPERATOR_LT = 'lt';
const FILTER_OPERATOR_GTE = 'gte';
const FILTER_OPERATOR_LTE = 'lte';
const filterOperators = [
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
];
/**
 * Method to clean the filters sent in query parameters
 *
 * @param {object} filters from query parameters
 * @param {Array} filterableFields the fields allowed to be used as a filter
 * @returns {Array} Ready-to-use array of filter object { name: 'foo', value: 'bar', operator: 'eq' }
 */
const filtersSanitizer = (filters, filterableFields) => {
    if (!filters || typeof filters !== 'object') {
        return [];
    }

    return Object.keys(filters)
        .map((filterKey) => {
            const [filterName, filterOperator] = filterKey.split(':');
            if (!filterableFields.includes(filterName)) {
                return null;
            }

            const filterValue = filters[filterKey];
            return {
                name: filterName,
                value: filterValue,
                operator:
                    !filterOperator || !filterOperators.includes(filterOperator)
                        ? FILTER_OPERATOR_EQ
                        : filterOperator,
            };
        })
        .filter((filter) => filter !== null);
};

/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {Array} sortableFields the fields allowed to be used as a sort
 * @returns {object} Ready-to-use sort object { sortBy, orderBy } for the sql query
 */
const sortSanitizer = (sort, sortableFields) => {
    if (!sort) {
        return null;
    }
    const { sortBy, orderBy } = sort;
    if (!sortableFields.includes(sortBy)) {
        return sortableFields.length ? sortableFields[0] : null;
    }

    if (!orderBy || !['ASC', 'DESC'].includes(orderBy)) {
        return {
            sortBy,
            orderBy: 'ASC',
        };
    }

    return sort;
};

/**
 * Function to clean the pagination sent in query parameters
 *
 * @param {object} pagination - pagination object from query parameters
 * @returns {object} Ready-to-use filters for the sql query
 */
const paginationSanitizer = ({ perPage, currentPage }) => {
    return {
        perPage: parseInt(perPage, 10) || 10,
        currentPage: parseInt(currentPage, 10) || 1,
    };
};

/**
 * Function to return a single pagination information
 *
 * @param {object}
 * @returns {String}
 * @example </api/job-postings?currentPage=1&perPage=10>; rel="self"
 */
const linkHeaderItem = ({ resourceURI, currentPage, perPage, rel }) => {
    const params = {
        currentPage,
        perPage,
    };
    return `<${resourceURI}?${querystring.stringify(params)}>; rel="${rel}"`;
};

/**
 * Function to return a fill pagination information with
 * first, prev, self, next and last relations.
 *
 * @param {object}
 * @returns {String}
 */
const formatPaginationToLinkHeader = ({ resourceURI, pagination = {} }) => {
    const { currentPage, perPage, lastPage } = pagination;

    if (!resourceURI || !currentPage || !perPage || !lastPage) {
        return null;
    }

    const prevPage =
        currentPage - 1 <= lastPage && currentPage - 1 > 0
            ? currentPage - 1
            : currentPage;
    const nextPage =
        currentPage + 1 <= lastPage ? currentPage + 1 : currentPage;

    let items = [
        { resourceURI, currentPage: 1, perPage, rel: 'first' },
        {
            resourceURI,
            currentPage: prevPage,
            perPage,
            rel: 'prev',
        },
        { resourceURI, currentPage, perPage, rel: 'self' },
        {
            resourceURI,
            currentPage: nextPage,
            perPage,
            rel: 'next',
        },
        {
            resourceURI,
            currentPage: lastPage,
            perPage,
            rel: 'last',
        },
    ];

    return items.map((item) => linkHeaderItem(item)).join(',');
};

module.exports = {
    filtersSanitizer,
    paginationSanitizer,
    sortSanitizer,
    formatPaginationToLinkHeader,
    prepareQueryParametersForList,
    FILTER_OPERATOR_EQ,
    FILTER_OPERATOR_GT,
    FILTER_OPERATOR_GTE,
    FILTER_OPERATOR_LT,
    FILTER_OPERATOR_LTE,
};
