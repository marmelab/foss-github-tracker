import React, { useState, useEffect } from 'react';
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
} from 'recharts';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const prepareDataForRadar = (rawData, filter = 'dotNotFilter') => {
    const { total, ...languages } = rawData;
    return Object.keys(languages).map((language) => ({
        value: languages[language].total,
        name: language,
        fullMark: total,
    })).sort((a,b) => {
        if (a.name < b.name)
            return 1;
        if (a.name > b.name)
            return -1;
        return 0;
    }).filter(l => l.name !== filter);
}
const LanguageChart = ({ rawData }) => {
    const [filter, setFilter] = useState('doNotFilter');
    const [data, setData] = useState();

    useEffect(() => {
        const freshData = prepareDataForRadar(rawData, filter);
        setData(freshData);
    }, [rawData, filter]);

    const handleFilter = (event) => {
        if (event.target.checked) {
            setFilter('JavaScript');
        } else {
            setFilter('doNotFilter');
        }
    };

    return (
        <>
            <RadarChart cx={300} cy={180} outerRadius={140} width={600} height={350} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis/>
                <Radar name="Global" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
            </RadarChart>
            <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                    <FormControlLabel
                        value={filter}
                        control={
                            <Switch
                                checked={filter === 'JavaScript'}
                                onChange={handleFilter}
                                name="withoutJavascript"
                                color="primary"
                            />
                        }
                        label="Without Javascript"
                        labelPlacement="end"
                    />
                </FormGroup>
            </FormControl>
        </>
    );
};

export default LanguageChart;

