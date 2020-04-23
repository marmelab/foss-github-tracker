import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChartIcon from '@material-ui/icons/PieChart';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CardIcon from '../CardIcon';
import DecisionChart from './Decisions';
import LanguageChart from './Languages';


export const COLORS = ['#B9362B', '#EFCB27', '#4E9FA5', '#316C4F', '#DB4748', '#E5D871', '#4EA57F'];
export const getPercent = (value, total) => Math.round(parseInt(value, 10) * 100 / parseInt(total, 10));

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
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Statistics
                    </Typography>
                </CardContent>
                <CardContent>
                    <DecisionChart rawData={statistics.decisions} total={statistics.total} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Statistics;


