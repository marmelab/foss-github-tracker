import React from 'react';
import Card from '@material-ui/core/Card';
import TrackedIcon from '@material-ui/icons/GpsFixed';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CardIcon from './CardIcon';

const useStyles = makeStyles({
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
        minHeight: 52,
    },
    title: {},
});

const Repositories = ({ repositories }) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <CardIcon Icon={TrackedIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary">
                    { repositories.length }
                </Typography>
                <Typography variant="h5" component="h2">
                    Maintained Repositories
                </Typography>
            </Card>
        </div>
    );
};

export default Repositories;



