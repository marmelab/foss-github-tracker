import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TrackedIcon from '@material-ui/icons/GpsFixed';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { useRedirect } from 'react-admin';

import CardIcon from './CardIcon';
import Repository from './Repository';

const useStyles = makeStyles((theme) => ({
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
    repoList: {
        display: 'flex',
        textAlign: 'left',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(2),
            padding: 0,
            width: theme.spacing(66),
            minHeight: theme.spacing(30),
        },
    },
}));

const Repositories = ({ repositories }) => {
    const classes = useStyles();

    return (
        <div className={classes.main}>
            <CardIcon Icon={TrackedIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        { repositories.length } Maintained Repositories
                    </Typography>
                </CardContent>
                <CardContent className={classes.repoList}>
                    {repositories
                            .filter(r => !r.isReactAdmin)
                            .sort((a,b) => {
                                if (a.openIssuesNumber < b.openIssuesNumber)
                                    return 1;
                                if (a.openIssuesNumber > b.openIssuesNumber)
                                    return -1;
                                return 0;
                            }).map(repository => (
                        <Repository repository={repository} />
                    ))}
                </CardContent>
                <CardContent>
                    <Typography variant="h4" component="h4" style={{ textAlign: 'center' }}>
                        react-admin repositories
                    </Typography>
                </CardContent>
                <CardContent className={classes.repoList}>
                    {repositories
                            .filter(r => r.isReactAdmin)
                            .sort((a,b) => {
                                if (a.starsNumber < b.starsNumber)
                                    return 1;
                                if (a.starsNumber > b.starsNumber)
                                    return -1;
                                return 0;
                            }).map(repository => (
                        <Repository repository={repository} />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default Repositories;



