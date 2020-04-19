import React from 'react';
import {
    Edit,
    ReferenceArrayInput,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
} from 'react-admin';

import { decisions } from './index';

const Title = ({ record }) =>
    record ? `Edit repository "${record.name}"` : null;

export default (props) => (
    <Edit title={<Title />} {...props}>
        <SimpleForm>
            <SelectInput
                source="decision"
                label="Statut"
                choices={decisions}
                fullWidth
            />
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

