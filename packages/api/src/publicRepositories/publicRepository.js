const NONE = 'none';
const MAINTAINED = 'maintained';
const TRANSMITTED = 'transmitted';
const HACKDAY = 'hackday';
const PUBLICATION = 'publication';
const ONBOARDING = 'onboarding';
const ARCHIVED = 'archived';

const decisions = [
    { id: NONE, name: 'none' },
    { id: MAINTAINED, name: 'maintained' },
    { id: TRANSMITTED, name: 'transmitted' },
    { id: HACKDAY, name: 'hackday' },
    { id: PUBLICATION, name: 'publication' },
    { id: ONBOARDING, name: 'onboarding' },
    { id: ARCHIVED, name: 'archived' },
];

module.exports = {
    NONE,
    MAINTAINED,
    decisions,
};
