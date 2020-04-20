import RepoIcon from '@material-ui/icons/GitHub';
import List from './List';
import Edit from './Edit';


export const NONE = 'none';
export const MAINTAINED = 'maintained';
export const TRANSMITTED = 'transmitted';
export const HACKDAY = 'hackday';
export const PUBLICATION = 'publication';
export const ONBOARDING = 'onboarding';
export const ARCHIVED = 'archived';

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
    edit: Edit,
    icon: RepoIcon,
    options: { label: 'Public Repositories' }
};
