import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
// Graphql
//import { useQuery, useLazyQuery, gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        marginTop: '10px',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

const Search = () => {
    const classes = useStyles();
    /* TODO: Replace 
        - Replace profilePicture for the path and file of the user picture
        - Add the query to iterate over profiles
        - Delete the name of the data variable returned by the query if needed
    */

    const profilePicture = '';
    //Queries Results
    const data = { getProfiles: [
        {
            user: {
                id: 1,
                name: 'Angel Zacarias',
              },
              carrer: 'Ingeniería en Computación',
              bio: 'Hello there!',
        },
        {
            user: {
                id: 2,
                name: 'Julio Antonio Gonzalez',
              },
              carrer: 'Ingeniería en Computación',
              bio: 'Mi mejor amigo es Zacarias!',
        },
    ]};
    const loading = false;
    const called = false;
    const error = null;

    const handleClick = (id) =>{
        console.log(`You have clicked on the profile ${id}`);
    }

    return (
    <Fragment>
        {
            // Validations for the query
            loading ?
                <LinearProgress />
            : error && error.message ?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <strong>Ocurrio un error al obtener las materias</strong> - {error.message}
                </Alert>
            : !loading && called && data.getProfiles.length < 1 ?
                <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                   No pudimos encontrar ninguna coincidencia... Invita a tus amigos a unirse!
                </Alert>
            :
                null
        }
        <List className={classes.root} component="nav">
            { data && data.getProfiles ? 
                <Fragment>
                    {
                        data.getProfiles.map(profile =>(
                            <Fragment 
                                key={profile.user.id}
                            >
                                <ListItem 
                                    alignItems="flex-start"
                                    button
                                    onClick={() => handleClick(profile.user.id)}
                                >
                                    <ListItemAvatar>
                                    <Avatar alt={profile.user.name} src={profilePicture} />
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={profile.user.name}
                                    secondary={
                                        <Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {profile.carrer}
                                        </Typography>
                                        {` — ${profile.bio}`}
                                        </Fragment>
                                    }
                                    />
                                </ListItem>
                                <Divider variant="middle" component="li" />
                            </Fragment>
                        ))
                    }
                </Fragment>
                : null
            }
        </List>
    </Fragment>
    );
}
 
export default Search;