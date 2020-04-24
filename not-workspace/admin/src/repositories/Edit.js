import React from 'react';
import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
    Toolbar,
    SaveButton,
} from 'react-admin';

import { decisions } from './index';

const Title = ({ record }) =>
    record ? `Edit repository "${record.name}"` : null;

const CustomToolbar = props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
);

export default (props) => (
    <Edit title={<Title />} {...props}>
        <SimpleForm  toolbar={<CustomToolbar />}>
            <SelectInput
                source="decision"
                label="Statut"
                choices={decisions}
                fullWidth
            />
            <BooleanInput label="Is a React Admin Repository ?" source="isReactAdmin" />
            <ReferenceArrayInput
                label="Maintainers"
                source="maintainerids"
                reference="contributors"
            >
                <SelectArrayInput optionText="login" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);

