import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChartIcon from '@material-ui/icons/PieChart';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

const COLORS = ['#B9362B', '#EFCB27', '#4E9FA5', '#316C4F', '#DB4748', '#E5D871', '#4EA57F'];

const getPercent = (value, total) => Math.round(parseInt(value, 10) * 100 / parseInt(total, 10));

const Statistics = ({ statistics }) => {
    const classes = useStyles();
    const data = Object.keys(statistics.decisions).map((decision) => ({
        value: statistics.decisions[decision],
        name: `${decision} (${getPercent(statistics.decisions[decision], statistics.total)}%)`,
    })).sort((a,b) => {
        if (a.value < b.value)
            return 1;
        if (a.value > b.value)
            return -1;
        return 0;
    });
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
                    <PieChart width={800} height={450}>
                        <Legend layout="vertical" align="left" verticalAlign="top" />
                        <Pie dataKey="value" isAnimationActive={true} data={data} cx={400} cy={200} outerRadius={200}>
                            {
          	                    data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                            }
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </CardContent>
            </Card>
        </div>
    );
};

export default Statistics;


