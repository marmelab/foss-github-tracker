import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

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

    return (
        <div className={classes.root}>
            <Card>
                <Title title="Public RepOsitories Tracking (Marmelab's GitHub)" />
                <CardContent>Lorem ipsum sic dolor amet...</CardContent>
            </Card>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <p>Something</p>
                </Grid>
                <Grid item xs={6}>
                    <p>Another Thing</p>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={11}>
                    <Paper className={classes.paper}>
                        <p>Paper</p>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs style={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        href="#/repositories"
                    >
                        All repositories
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;

