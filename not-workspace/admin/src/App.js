/* eslint-disable react/jsx-key */
import React from 'react';
import { Admin, Resource } from 'react-admin';

import Dashboard from './dashboard';
import dataProvider from './dataProvider';
import contributors from './contributors';
import repositories from './repositories';

const App = () => (
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="repositories" {...repositories} />
        <Resource name="contributors" {...contributors} />
        <Resource name="licenses" />
        <Resource name="languages" />
    </Admin>
);

export default App;

