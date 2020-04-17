/* eslint-disable react/jsx-key */
import React from 'react';
import { Admin, Resource } from 'react-admin';

import dataProvider from './dataProvider';
import contributors from './contributors';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="contributors" {...contributors} />
    </Admin>
);

export default App;

