import Typography from '@material-ui/core/Typography';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import MiddleDivider from 'views/Profile/MiddleDivider';


const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Profile = () => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid item xs={12} sm={12} >
          <Typography gutterBottom variant="h3">
            Perfil
          </Typography>
        </Grid> 
        <MiddleDivider />
      </div>
    </Container>
  );
}

export default Profile;
