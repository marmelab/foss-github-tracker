import React from 'react';
import { PropTypes } from 'prop-types';
import {
    List,
    Datagrid,
    TextField,
    ReferenceArrayField,
    SingleFieldList,
} from 'react-admin';
import Chip from '@material-ui/core/Chip';

import { MAINTAINED } from '../repositories';

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

const Repository = ({ record }) => {
    if (!record || record.decision !== MAINTAINED ) return null;
    return (
        <Chip
            label={record.name || record.id}
        />
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
                <ReferenceArrayField
                    label="project maintainer"
                    source="repositories"
                    reference="repositories"
                    sortable={false}
                >
                    <SingleFieldList>
                        <Repository />
                    </SingleFieldList>
                </ReferenceArrayField>
            </Datagrid>
        </List>
    );
};

