import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { useRedirect } from 'react-admin';

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
    list: {
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const Todo = ({ archives, decisions, warnings }) => {
    const classes = useStyles();
    const redirect = useRedirect();

    const handleUnDecisions = () =>
        redirect(`/repositories?filter={"decision"%3A"none"}&page=1&perPage=${decisions.length}`);

    const handleUnArchived = () => {//http://localhost:8000/#/repositories?filter={%22id:in%22%3A%22[163,%20100]%22}
        const ids = archives.map(repo => repo.id);
        redirect(`/repositories?filter={"d:in"%3A${JSON.stringify(ids)}&page=1&perPage=${archives.length}`);
    }

    const openGitHub = (name) =>  {
        window.open(`https://github.com/marmelab/${name}`, '_blank');
    }

    return (
        <div className={classes.main}>
            <CardIcon Icon={PlaylistAddCheckIcon} bgColor="#808080" />
            <Card className={classes.card}>
                <CardContent>
                <Typography variant="h5" component="h2">
                    { archives.length + decisions.length + warnings.length } Items in the Todo List
                </Typography>
                </CardContent>
                <CardContent>
                    <List component="nav" className={classes.list}>
                        <ListItem button onClick={handleUnDecisions} >
                            <Typography variant="h6" component="h3">
                                {`${decisions.length} repositories have no status`}
                            </Typography>
                        </ListItem>
                        <Divider />
                        <ListItem button divider onClick={handleUnArchived}>
                            <Typography variant="h6" component="h3">
                                {`${archives.length} unmaintained repositories are not archived on Github.`}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography variant="h6" component="h3">
                                {`${warnings.length} maintained repositories need love.`}
                            </Typography>
                        </ListItem>
                    </List>
                    <List component="div" disablePadding>
                        { warnings.length > 0 && warnings.map((repo) => (
                            <ListItem key={repo.id} button className={classes.nested} onClick={() => openGitHub(repo.name)}>
                                <Typography variant="h6" component="h6">
                                    * {repo.name} <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                                        ({repo.warnings.join(' ')}) </span>
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </div>
    );
};

export default Todo;

