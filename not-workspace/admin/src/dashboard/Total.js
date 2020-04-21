import React from 'react';
import Card from '@material-ui/core/Card';
import RepoIcon from '@material-ui/icons/GitHub';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CardIcon from './CardIcon';

const useStyles = makeStyles({
    main: {
        flex: '1',
        marginRight: '1em',
        marginTop: 20,
        marginBottom: 40,
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
        minHeight: 52,
    },
    title: {},
});

const Total = ({ value }) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <CardIcon Icon={RepoIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary">
                    Marmelab's public repositories on GitHub
                </Typography>
                <Typography variant="h5" component="h2">
                    {value}
                </Typography>
            </Card>
        </div>
    );
};

export default Total;
