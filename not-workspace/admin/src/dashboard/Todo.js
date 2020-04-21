import React from 'react';
import Card from '@material-ui/core/Card';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
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

const Todo = ({ archives, decisions, warnings }) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <CardIcon Icon={PlaylistAddCheckIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary">
                    { archives.length + decisions.length + warnings.length }
                </Typography>
                <Typography variant="h5" component="h2">
                    Todo List
                </Typography>
            </Card>
        </div>
    );
};

export default Todo;

