import React from 'react';
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from 'recharts';

import { getPercent } from './index';

const DecisionChart = ({ rawData, total }) => {
    const data = Object.keys(rawData).map((decision) => ({
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
                <RadarChart cx={300} cy={180} outerRadius={140} width={600} height={350} data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis/>
                    <Radar name="Global" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                </RadarChart>
    );
};

export default DecisionChart;



