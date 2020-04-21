import React from 'react';
import Card from '@material-ui/core/Card';
import ChartIcon from '@material-ui/icons/PieChart';
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

const Statistics = ({ statistics }) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <CardIcon Icon={ChartIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <Typography variant="h5" component="h2">
                    Statistics
                </Typography>
            </Card>
        </div>
    );
};

export default Statistics;


