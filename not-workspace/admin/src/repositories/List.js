import React from 'react';
import {
    BooleanField,
    Datagrid,
    DateField,
    EditButton,
    Filter,
    List,
    NumberField,
    ReferenceArrayField,
    ReferenceInput,
    SelectInput,
    SingleFieldList,
    TextField,
    TextInput,
} from 'react-admin';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

import { decisions } from './index';

const Mainteneur = ({ record }) => {
    if (!record) return null;
    return (
        <Chip
            avatar={<Avatar alt={record.login} src={record.avatarUrl} />}
            label={record.name || record.login}
        />
    );
};

const Links = ({ record }) => {
    if (!record) return null;
    return (
        <>
            <Button variant="outlined" size="small" color="primary" href={`https://github.com/marmelab/${record.name}`} target="_blank">
                Github
            </Button>
            {record.homepage && record.homepage !== 'none' && (
                <Button variant="outlined" size="small" href={record.homepage} target="_blank">
                    HomePage
                </Button>

            )}
        </>
    );
};

const RepositoryFilters = (props) => (
    <Filter {...props}>
        <SelectInput
            source="decision"
            label="Status"
            choices={decisions}
            style={{ minWidth: 250 }}
            alwaysOn
        />
        <ReferenceInput
            label="License"
            source="license:eq"
            reference="licenses"
            alwaysOn
        >
            <SelectInput />
        </ReferenceInput>
        <ReferenceInput
            label="Languages"
            source="primaryLanguage:eq"
            reference="languages"
            alwaysOn
        >
            <SelectInput />
        </ReferenceInput>
        <TextInput
            source="name:%l%"
            label="Name"
            style={{ minWidth: 250 }}
            alwaysOn
        />
        <ReferenceInput
            label="Maintainer"
            source="maintainer:eq"
            reference="contributors"
            alwaysOn
        >
            <SelectInput  optionText="login" />
        </ReferenceInput>
    </Filter>
);

const RepositoriesDataGrid = (props) => (
    <Datagrid {...props} >
        <TextField source="name" label="Name" />
        <Links label="Link.s" />
        <TextField source="decision" label="Status" />
        <BooleanField source="isArchived" label="Archived" />
        <TextField source="license" label="Licence" />
        <TextField source="primaryLanguage" label="Language" />
        <NumberField source="starsNumber" label="Stars" />
        <NumberField source="forkNumber" label="Forks" />
        <NumberField source="openIssuesNumber" label="Open Issues" />
        <DateField source="createdAt" label="Created at"/>
        <DateField source="updatedAt" label="Last update" />
        <DateField source="pushedAt" label="Last push"/>
        <ReferenceArrayField label="Maintainer.s" source="maintainerids" reference="contributors">
            <SingleFieldList>
                <Mainteneur />
            </SingleFieldList>
        </ReferenceArrayField>
        <EditButton />
    </Datagrid>
);

export default (props) => (
    <List
        {...props}
        filters={<RepositoryFilters />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        bulkActionButtons={false}
        title="Marmelab's public repositories on Github"
    >
        <RepositoriesDataGrid {...props} />
    </List>
);

