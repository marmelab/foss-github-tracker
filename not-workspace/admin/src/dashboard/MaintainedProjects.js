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

import CardIcon from './CardIcon';

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
    title: {},
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
    repoTitleOk: {
        padding: theme.spacing(0.7, 0, 1, 1),
        textTransform: 'lowercase',
        fontVariant: 'small-caps',
        fontWeight: 600,
        borderBottom: '4px solid green',
    },
    repoTitleWarning: {
        padding: theme.spacing(0.7, 0, 1, 1),
        textTransform: 'lowercase',
        fontVariant: 'small-caps',
        fontWeight: 600,
        borderBottom: '4px solid orange',
    },
    repoTitleKo: {
        padding: theme.spacing(0.7, 0, 1, 1),
        textTransform: 'lowercase',
        fontVariant: 'small-caps',
        fontWeight: 600,
        borderBottom: '4px solid red',
    },
    repoDescription: {
        fontSize: '1.1rem',
        padding: theme.spacing(1),
    },
    license: {
        fontSize: '0.9rem',
        padding: theme.spacing(0, 1, 1, 1),
        fontStyle: 'italic',
    },
    gridMaintainer: {
        textAlign: 'right',
        paddingTop: theme.spacing(1),
        minHeight: 150,
    },
    maintainer: {
        margin: theme.spacing(0.5),
    },
    repoFooter: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(0.7, 0, 1, 1),
    },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

const Maintainer = ({ maintainer, classe }) => {
    return (
        <Chip
            avatar={<Avatar alt={maintainer.login} src={maintainer.avatarUrl} />}
            label={maintainer.name || maintainer.login}
            className={classe}
        />
    );
};

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
                    {repositories.map(repository => (
                        <Paper key={repository.id} elevation={2}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h4"
                                        component="h2"
                                        className={!repository.warnings
                                            ? classes.repoTitleOk
                                            : repository.warnings.length > 1
                                            ? classes.repoTitleKo
                                            : classes.repoTitleWarning
                                        }
                                    >
                                        {repository.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" component="p" className={classes.repoDescription}>
                                        {repository.description}
                                    </Typography>
                                    <Typography variant="body2" component="p" className={classes.license}>
                                        {repository.license !== 'none' ? repository.license : 'No License !'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} className={classes.gridMaintainer}>
                                    {repository.maintainers && repository.maintainers.map(maintainer => (
                                        <Maintainer maintainer={maintainer} classe={classes.maintainer} />
                                    ))}
                                    {!repository.maintainers && (
                                        <Typography variant="body2" component="p" className={classes.license}>
                                            No maintainer !
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        href={`https://github.com/marmelab/${repository.name}`}
                                        target="_blank"
                                        style={{ margin: '0.5rem' }}
                                    >
                                        Github
                                    </Button>
                                    {repository.homepage && repository.homepage !== 'none' && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            href={repository.homepage}
                                            target="_blank"
                                            style={{ margin: '0.5rem' }}
                                        >
                                            HomePage
                                        </Button>
                                    )}
                                </Grid>
                                <Grid
                                    item xs={12}
                                    className={classes.repoFooter}
                                >
                                    {repository.warnings && (
                                        <LightTooltip title={repository.warnings.join(' ')} placement="right-start">
                                            <Chip
                                                label={`Warnings: ${repository.warnings.length}`}
                                                variant="outlined"
                                                size="small"
                                                style={{ marginRight: '0.5rem' }}
                                            />
                                        </LightTooltip>
                                    )}
                                    <Chip
                                        label={`Stars: ${repository.starsNumber}`}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <Chip
                                        label={`Forks: ${repository.forkNumber}`}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <Chip
                                        label={`Open issues: ${repository.openIssuesNumber}`}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <Chip
                                        label={`Open PR.s: ${repository.openPullRequestsNumber}`}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <Chip
                                        label={`Watchers: ${repository.watchersNumber}`}
                                        variant="outlined"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default Repositories;



