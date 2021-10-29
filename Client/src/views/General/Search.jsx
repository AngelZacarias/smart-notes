// Graphql
import { gql, useQuery } from '@apollo/client';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
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
        - Delete the name of the data variables returned by the query if needed
    */

    // This function obtains the parameter from the URL
    const getKeyWordParameter = () =>{
        const urlString = window.location.href;
        const url = new URL(urlString);
        return url.searchParams.get("keyword");
    }

    const profilePicture = '';
    const{data, loading, error, called} = useQuery(GET_PROFILES, {
        variables: {
            keyword: getKeyWordParameter(),
        },
        context: {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
          }
        },
        fetchPolicy: "cache-and-network",
    });

    return (
    <Fragment>
        <h5>Resultados para {getKeyWordParameter()}...</h5>
        {
            // Validations for the query
            loading ?
                <LinearProgress />
            : error && error.message ?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <strong>Ocurrió un error al obtener los perfiles</strong> - {error.message}
                </Alert>
            : !loading && called && data.getProfiles.length < 1 ?
                <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                   No pudimos encontrar ninguna coincidencia... Invita a tus amigos a unirse!
                </Alert>
            :        
            <List className={classes.root} component="nav">
                { data && data.getProfiles ? 
                    <Fragment>
                        {
                            data.getProfiles.map(user =>(
                                <Fragment 
                                    key={user.id}
                                >
                                    <ListItem 
                                        alignItems="flex-start"
                                        button
                                        component={Link}
                                        value={user.id}
                                        to={`/dashboard/profile/${user.id}`}
                                        color="secondary"   
                                    >
                                        <ListItemAvatar>
                                        <Avatar alt={user.name} src={profilePicture} />
                                        </ListItemAvatar>
                                        <ListItemText
                                        primary={user.name + ' ' + user.lastName}
                                        secondary={
                                            <Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                            >
                                                {user.profile.carrer}
                                            </Typography>
                                            {` — ${user.profile.bio}`}
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
        }
    </Fragment>
    );
}

const GET_PROFILES = gql`
query getProfiles($keyword: String!){
  getProfiles(keyword:$keyword){
    id,
    name,
    lastName,
    profile {
      carrer,
      bio,
    }
  }
}
`;

export default Search;