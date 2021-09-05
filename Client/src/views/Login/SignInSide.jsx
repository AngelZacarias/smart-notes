import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { IconButton, Snackbar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from "formik";
import React, { useEffect, useState } from 'react';
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";

const { saveTokenToLocalStorage } = require("../../services/user/user-service")

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(assets/img/login${Math.floor(Math.random()*(4-1))+1}.jpg)`,
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
const SignInSide = () => {
  //Auth Google
  const [sendMutation, { data: userDataResponse }] = useMutation(REGISTER_USER);
  const [something, setSomething] = useState(false);
  const [getUser, { loading, error, data }] = useLazyQuery(NORMAL_LOGIN_USER);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleClickLogin = () => {
    setShowMessage(true)
  }

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }

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
          console.log("Nombre completo:", googleUser.Ts.Ne)
          console.log("Correo:", googleUser.Ts.Et)
          console.log("Url imagen perfil:", googleUser.Ts.hJ)
          console.log("token:", googleUser.Zb.id_token)
          
          sendMutation({
            variables: {
              name: googleUser.Ts.Ne,
              lastName: googleUser.Ts.Et,
              email: googleUser.Ts.hJ,
              token: googleUser.Zb.id_token
            }
          }).catch(err => {
            console.log(JSON.stringify(err, null, 2));
            alert(err.message);
          });
        });
      });
      setSomething(false);
    }
  }, [something]);

  //From Google login
  useEffect(() => {
    if(userDataResponse) {
      console.log("Respuesta de userDataResponse:", userDataResponse)
      setMessage("Inicio de sesión con Google correcto")
      setShowMessage(true)
      saveTokenToLocalStorage(userDataResponse)
      setTimeout(() => window.location.href = "/dashboard/subjects", 1000);
    }
  }, [userDataResponse]);

  //From Login
  useEffect(() => {
    if (loading)
      console.log("Loading:", loading)
    if (error){
      console.log("Error message:", error.graphQLErrors[0].message)
      setMessage(error.graphQLErrors[0].message)
      setShowMessage(true)
      console.log(JSON.stringify(error, null, 2));
    }
    if (data){
      console.log("Esto retorno Data:", data)
      saveTokenToLocalStorage(data);
      window.location.href = "/dashboard/subjects";
    }
  }, [loading, error, data]);

  function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          SmartNotes
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
            SmartNotes - Iniciar sesión
          </Typography>
          <Formik
            initialValues={{email: "", password: ""}}
            onSubmit={ (values, {setSubmitting }) => {
              console.log("Login", values);
              setSubmitting(false);
            }}
          >
          { props => {
            const {
              values, isSubmitting, handleChange, handleSubmit
            } = props;
            return (
              <form  noValidate onSubmit={handleSubmit}>
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
                  value={values.email}
                  onChange={handleChange}
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
                  value={values.password}
                  onChange={handleChange}
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
                  disabled={isSubmitting}
                  onClick={() => {
                    getUser({ variables: { email: values.email, password: values.password } })
                    handleClickLogin
                  }}
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
            );
          }}  
          </Formik>
          <br></br>
          <Typography component="h1" variant="h5">
            SmartNotes - Iniciar sesión con Google
          </Typography>
          <Button 
            className="g-signin2" 
            onClick={() => {
              setSomething(true)
              handleClickLogin
            }}
            id="googleButtonSignIn"
          >
          </Button>
          <Box mt={5}>
              <Copyright />
          </Box>
          {/* Snackbar */}
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            TransitionComponent={Slide}
            open={showMessage}
            autoHideDuration={4000}
            onClose={handleCloseMessage}
            message={message}
            action={
              <React.Fragment>
                <IconButton onClick={handleCloseMessage}>
                  <CloseIcon />
                </IconButton>
              </React.Fragment>
            } 
          />
        </div>
      </Grid>
    </Grid>
  );
}

const REGISTER_USER = gql`
mutation($name: String!, $lastName: String!, $email: String!, $token: String!){
  createUserFromGoogleAuth(name: $name, lastName: $lastName, email: $email, token: $token){
    name,
    lastName,
    email,
    active,
    createdAt,
    updatedAt,
    token
  }
}
`;

const NORMAL_LOGIN_USER = gql`
query($email: String!, $password: String!) {
  normalLogin(email: $email, password: $password) {
    token
  }
}
`;

export default SignInSide;