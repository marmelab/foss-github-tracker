const {
    prepareQueryParametersForList,
    filtersSanitizer,
} = require('./sanitizers');

describe('Sanitizers', () => {
    describe('prepareQueryParametersForList', () => {
        it('should return an empty object of filters, null sort and default pagination without query params', () => {
            expect(prepareQueryParametersForList()).toEqual({
                filters: {},
                sort: null,
                pagination: { currentPage: 1, perPage: 25 },
            });
        });

        it('should split query params into filters, sort and pagination props', () => {
            expect(
                prepareQueryParametersForList({
                    sortBy: 'name',
                    orderBy: 'DESC',
                    perPage: 10,
                    currentPage: 3,
                    ['age:gte']: 40,
                })
            ).toEqual({
                filters: { ['age:gte']: 40 },
                sort: { sortBy: 'name', orderBy: 'DESC' },
                pagination: { currentPage: 3, perPage: 10 },
            });
        });
    });

    describe('filtersSanitizer', () => {
        it('should return an empty array if query filters are not set', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(undefined, defaultFilterableFields)
            ).toEqual([]);
        });

        it('should return an empty array if query filters is not an object', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer('filters', defaultFilterableFields)
            ).toEqual([]);
        });

        it('should return an array with well formated accepted filters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { ['foo:eq']: 'not-bar' },
                    defaultFilterableFields
                )
            ).toEqual([
                {
                    name: 'foo',
                    value: 'not-bar',
                    operator: 'eq',
                },
            ]);
        });

        it('should set the default eq operator if operator is not set', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer({ foo: 'not-bar' }, defaultFilterableFields)
            ).toEqual([
                {
                    name: 'foo',
                    value: 'not-bar',
                    operator: 'eq',
                },
            ]);
        });

        it('should set the default eq operator if operator is not valid', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { ['foo:notValid']: 'not-bar' },
                    defaultFilterableFields
                )
            ).toEqual([
                {
                    name: 'foo',
                    value: 'not-bar',
                    operator: 'eq',
                },
            ]);
        });

        it('should remove not accepted filters', () => {
            const defaultFilterableFields = ['foo', 'bar'];
            expect(
                filtersSanitizer(
                    { ['foo:lt']: 'not-bar', ['out:eq']: 'in' },
                    defaultFilterableFields
                )
            ).toEqual([
                {
                    name: 'foo',
                    value: 'not-bar',
                    operator: 'lt',
                },
            ]);
        });
    });
});
