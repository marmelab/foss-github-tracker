import React from 'react';
import {
    Datagrid,
    DateField,
    Filter,
    List,
    TextInput,
    DateInput,
    TextField,
    NumberField,
    SelectInput,
} from 'react-admin';

import { decisions } from './index';

const RepositoryFilters = (props) => (
    <Filter {...props}>
        <SelectInput
            source="decision"
            label="Statut"
            choices={decisions}
            style={{ minWidth: 250 }}
            alwaysOn
        />
        <TextInput
            source="name:%l%"
            label="Nom du repo"
            style={{ minWidth: 250 }}
            alwaysOn
        />
        <DateInput
            source="createdAt:le"
            label="Créé avant le"
            style={{ minWidth: 250 }}
        />
    </Filter>
);

const RepositoriesDataGrid = (props) => (
    <Datagrid {...props} >
        <TextField source="name" label="Nom" />
        <TextField source="decision" label="Statut" />
        <NumberField source="starsNumber" label="Nombr de stars" />
        <NumberField source="openIssuesNumber" label="Nombre d'issues ouvertes" />
        <DateField source="createdAt" label="Ouvert le"/>
        <DateField source="updatedAt" label="Mis à jour le" showTime />
    </Datagrid>
);

export default (props) => (
    <List
        {...props}
        filters={<RepositoryFilters />}
        sort={{ field: 'createdAt', order: 'ASC' }}
        perPage={25}
        bulkActionButtons={false}
        title="Tous les dépôts publics"
    >
        <RepositoriesDataGrid {...props} />
    </List>
);

