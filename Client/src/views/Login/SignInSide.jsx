import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from "react";
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/* global gapi */
export default function SignInSide() {
  //Auth Google
  const [sendMutation, { data: userDataResponse }] = useMutation(REGISTER_USER);
  const [something, setSomething] = useState(false);
  const [redirectToDashboardSubjects, setRedirectTo] = useState(true);

  useEffect(() => {
    if (something) {
      gapi.load('auth2', () => {
        var auth2 = gapi.auth2.getAuthInstance({
          client_id: "120055253095-6fqkpo06vfhm9ulk2ckjsm86jqlhlgjb.apps.googleusercontent.com",
          fetch_basic_profile: true,
          scope: 'profile'
        });
        auth2.signIn().then(googleUser => {
          console.log(googleUser);
          console.log("Nombre completo:", googleUser.Ft.Ve)
          console.log("Correo:", googleUser.Ft.pu)
          console.log("Url imagen perfil:", googleUser.Ft.vK)
          console.log("token:", googleUser.qc.id_token)
          
          sendMutation({
            variables: {
              name: googleUser.Ft.xV,
              lastName: googleUser.Ft.sT,
              email: googleUser.Ft.pu,
              token: googleUser.qc.id_token
            }
          }).catch(err => {
            alert(err.message);
          });
        });
      });
      setSomething(false);
    }
  }, [something]);

  useEffect(() => {
    console.log("userDataResponse: ", userDataResponse);
    if(userDataResponse) {
      setRedirectTo(false);
    }
    if(!redirectToDashboardSubjects) {
      console.log(redirectToDashboardSubjects)
      return <Redirect to="/dashboard/subjects" />
    }
    else 
      return <Redirect to="/login" />
  }, [userDataResponse]);

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {/* Normal login */}
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up" >
                  {"¿No tienes cuenta? Regístrate aquí"}
                </Link>
              </Grid>
            </Grid>
          </form>
          {/* Normal login */}
          <br></br>
          <Typography component="h1" variant="h5">
            SmartNotes - Iniciar sesión con Google
          </Typography>
          <Button 
            className="g-signin2" 
            onClick={() => setSomething(true)}
            id="googleButtonSignIn"
          >
          </Button>
          <Box mt={5}>
              <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}

const REGISTER_USER = gql`
mutation($name: String!, $lastName: String!, $email: String!, $token: String!){
  createUserFromGoogleAuth(name: $name, lastName: $lastName, email: $email, token: $token){
    id,
    name,
    lastName,
    email,
    active,
    createdAt,
    updatedAt
  }
}
`;