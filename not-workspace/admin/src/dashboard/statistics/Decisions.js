import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

    return (
        <PieChart width={800} height={450}>
            <Legend layout="vertical" align="left" verticalAlign="top" />
            <Pie dataKey="value" isAnimationActive={true} data={data} cx={400} cy={200} outerRadius={200}>
                {
                    data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                }
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default DecisionChart;



