import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    Legend,
    PolarAngleAxis,
    PolarRadiusAxis}
from 'recharts';

import { getPercent } from './index';

// const data = [
//     { subject: 'Math', A: 120, B: 110, fullMark: 150 },
//     { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
//     { subject: 'English', A: 86, B: 130, fullMark: 150 },
//     { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
//     { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
//     { subject: 'History', A: 65, B: 85, fullMark: 150 },
// ];

const LanguageChart = ({ languageStatistics: { total, ...rawData } }) => {
    const data = Object.keys(rawData).map((language) => ({
        language,
        value: getPercent(rawData[language].total, total),
        fullMark: 100,
    })).sort((a,b) => {
        if (a.language < b.language)
            return 1;
        if (a.language > b.language)
            return -1;
        return 0;
    });

  	return (
        <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
            <Legend layout="vertical" align="left" verticalAlign="top" />
            <PolarGrid />
            <PolarAngleAxis dataKey="language" />
            <PolarRadiusAxis/>
            <Radar name="Global" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
    );
  }

export default LanguageChart;
