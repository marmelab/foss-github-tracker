import UserIcon from '@material-ui/icons/People';
import List from './List';


const NONE = 'none';
const MAINTAINED = 'maintained';
const TRANSMITTED = 'transmitted';
const HACKDAY = 'hackday';
const PUBLICATION = 'publication';
const ONBOARDING = 'onboarding';
const ARCHIVED = 'archived';

export const decisions = [
    { id: NONE, name: 'none' },
    { id: MAINTAINED, name: 'maintained' },
    { id: TRANSMITTED, name: 'transmitted' },
    { id: HACKDAY, name: 'hackday' },
    { id: PUBLICATION, name: 'publication' },
    { id: ONBOARDING, name: 'onboarding' },
    { id: ARCHIVED, name: 'archived' },
];

export default {
    list: List,
    icon: UserIcon,
    options: { label: 'Les repo. publics' }
};
