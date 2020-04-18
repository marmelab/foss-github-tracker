import React from 'react';
import { PropTypes } from 'prop-types';
import {
    List,
    Datagrid,
    TextField,
} from 'react-admin';

const ContributorLogo = ({ record }) => {
    return record && record.avatarUrl ? (
        <img src={record.avatarUrl} height="50" alt={record.login} />
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


export const ContributorList = (props) => {
    return (
        <List
            {...props}
            sort={{ field: 'login', order: 'ASC' }}
            bulkActionButtons={false}
            title="La team"
            perPage={25}
        >
            <Datagrid>
                <ContributorLogo label="Logo" />
                <TextField source="login" label="Login" />
                <TextField source="name" label="Nom" />
            </Datagrid>
        </List>
    );
};

