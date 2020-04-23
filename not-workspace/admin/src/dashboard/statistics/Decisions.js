import React from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip,
} from 'recharts';
import Grid from '@material-ui/core/Grid';

import { COLORS, getPercent } from './index';

const DecisionChart = ({ rawData, total }) => {
    const data = Object.keys(rawData).map((decision) => ({
        value: rawData[decision],
        name: `${decision} (${getPercent(rawData[decision], total)}%)`,
    })).sort((a,b) => {
        if (a.value < b.value)
            return 1;
        if (a.value > b.value)
            return -1;
        return 0;
    });
    const dataRadar = Object.keys(rawData).map((decision) => ({
        value: rawData[decision],
        name: `${decision} (${getPercent(rawData[decision], total)}%)`,
        fullMark: total,
    })).sort((a,b) => {
        if (a.language < b.language)
            return 1;
        if (a.language > b.language)
            return -1;
        return 0;
    });

    return (
        <Grid container spacing={0}>
            <Grid item xs={6}>
                <PieChart width={600} height={350}>
                    <Legend layout="vertical" align="left" verticalAlign="middle" />
                    <Pie dataKey="value" isAnimationActive={true} data={data} cx={200} cy={150} outerRadius={150}>
                        {
                            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                        }
                    </Pie>
                    <Tooltip />
                </PieChart>
            </Grid>
            <Grid item xs={6}>
                <RadarChart cx={300} cy={180} outerRadius={140} width={600} height={350} data={dataRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis/>
                    <Radar name="Global" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                </RadarChart>
            </Grid>
        </Grid>
    );
};

export default DecisionChart;



