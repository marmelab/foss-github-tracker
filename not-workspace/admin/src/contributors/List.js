import React from 'react';
import { PropTypes } from 'prop-types';
import {
    List,
    Datagrid,
    TextField,
} from 'react-admin';
import Chip from '@material-ui/core/Chip';


const ContributorLogo = ({ record }) => {
    return record && record.avatarUrl ? (
        <img src={record.avatarUrl} height="100" alt={record.login} />
    ) : (
        `Pas d'image pour "${record.login}"`
    );
};
ContributorLogo.propTypes = {
    record: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
    }),
};

const Repository = ({ repo }) => {
    return (
        <Chip
            label={repo.name || repo.id}
        />
    );
};

const Projects = ({record}) => {
    if (!record || !record.repositories || !record.repositories.length ) return '-';
    return (
        <>
            <span>Maintainer for {record.repositories.length} repositor{record.repositories.length > 1 ? 'ies' : 'y'}</span><br />
            {record.repositories.map((repo) => <Repository key={`${record.id}_${repo.id}`} repo={repo} />)}
        </>
    );
};
export const ContributorList = (props) => {
    return (
        <List
            {...props}
            sort={{ field: 'login', order: 'ASC' }}
            bulkActionButtons={false}
            title="Github's Marmelab Team"
            perPage={25}
        >
            <Datagrid>
                <ContributorLogo label="" sortable={false}/>
                <TextField source="login" label="Login" />
                <TextField source="name" label="Name" />
                <Projects source="repositories" label="Maintainer for" />
            </Datagrid>
        </List>
    );
};

