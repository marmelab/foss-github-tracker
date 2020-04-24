import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { useRedirect } from 'react-admin';

const useStyles = makeStyles((theme) => ({
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
    },
    maintainer: {
        margin: theme.spacing(0.5),
    },
    chipContainer: {
        textAlign: 'left',
        marginBottom: theme.spacing(1),
    },
    chipInfo: {
        margin: theme.spacing(0.5),
    },
    repoFooter: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(0.7, 0, 1, 1),
    },
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
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

const Repository = ({ repository }) => {
    const classes = useStyles();
    const redirect = useRedirect();

    const handleEdit = (id) => {
        return redirect(`/repositories/${id}`);
    }

    return (
        <Paper elevation={2}>
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
                <Grid item xs={6} >
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
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        style={{ margin: '0.5rem' }}
                        onClick={() => handleEdit(repository.id)}
                    >
                        Edit
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
                    item xs={6}
                    className={classes.chipContainer}
                >
                    <Chip
                        label={`Stars: ${repository.starsNumber}`}
                        variant="outlined"
                        size="small"
                        className={classes.chipInfo}
                    />
                    <Chip
                        label={`Forks: ${repository.forkNumber}`}
                        variant="outlined"
                        size="small"
                        className={classes.chipInfo}
                    />
                    <Chip
                        label={`Open issues: ${repository.openIssuesNumber}`}
                        variant="outlined"
                        size="small"
                        className={classes.chipInfo}
                    />
                    <Chip
                        label={`Open PR.s: ${repository.openPullRequestsNumber}`}
                        variant="outlined"
                        size="small"
                        className={classes.chipInfo}
                    />
                    {repository.warnings && (
                        <HtmlTooltip
                            title={
                                <React.Fragment>
                                    <Typography style={{ textAlign: 'center' }} color="inherit">Warnings</Typography>
                                    <ol>
                                        {repository.warnings.map((warning, index) => (
                                            <li key={index}>{warning}</li>
                                        ))}
                                    </ol>
                                </React.Fragment>
                            }
                            placement="right-start"
                        >
                            <Chip
                                label={`Warnings: ${repository.warnings.length}`}
                                variant="outlined"
                                size="small"
                                className={classes.chipInfo}
                            />
                        </HtmlTooltip>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Repository;

