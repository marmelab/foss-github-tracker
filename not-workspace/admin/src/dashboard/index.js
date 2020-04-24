import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useDataProvider, Title } from 'react-admin';

import Total from './Total';
import Todo from './Todo';
import Statistics from './statistics';
import MaintainedProjects from './MaintainedProjects';

const Dashboard = () => {
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
    }));
    const classes = useStyles();
    const dataProvider = useDataProvider();
    const [ data, setData ] = useState(null);

    useEffect(() => {
        async function getDataForDashboard() {
            const { data: dashboardData } = await dataProvider.getList('dashboard', {
                sort: { field: 'id', order: 'ASC' },
                pagination: { page: 1, perPage: 1 }
            });
            setData(dashboardData);
        }
        getDataForDashboard();
    }, []);

    if (!data) {
        return (
            <div className={classes.root}>
                <Title title="Public Repositories Tracker"/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>Loading data</Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <Title title="Public Repositories Tracker"/>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Total value={data.statistics.total} />
                    <Todo
                        warnings={data.maintainedRepositoriesWarning}
                        archives={data.unMaintainedRepositoriesUnArchived}
                        decisions={data.repositoriesWithoutDecisions}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Statistics statistics={data.statistics} />
                </Grid>
                <Grid item xs={12}>
                    <MaintainedProjects repositories={data.maintainedRepositories} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;

