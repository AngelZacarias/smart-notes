import { gql, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { IconButton, Snackbar } from '@material-ui/core';
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";


export default function ValidatedSignUpForm() {
  const [sendMutationSignIn, { data: userDataResponse }] = useMutation(NORMAL_REGISTER_USER);
  const [signInFlag, setSignInFlag] = useState(
    {
      signIn: false,
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  );
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleClickSignUp = () => {
    setShowMessage(true)
  }

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }

  useEffect(() => {
    if(signInFlag.signIn) {
      console.log(signInFlag);
      sendMutationSignIn({
        variables: {
          name: signInFlag.name,
          lastname: signInFlag.lastname,
          email: signInFlag.email,
          password: signInFlag.password,
          confirmPassword: signInFlag.confirmPassword
        }
      }).catch(error => {
        setMessage(error.graphQLErrors[0].message)
        setShowMessage(true)
      });
      setSignInFlag({
        signIn: false,
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [signInFlag]);

  useEffect(() => {
    console.log(userDataResponse)
    if (userDataResponse) {
      
      window.location.href = "/login";
    }
  }, [userDataResponse]);

  return (
    <Formik
      initialValues={{name: "", lastname: "", email: "", password: "", confirmPassword: ""}}
      onSubmit={ (values, { setSubmitting }) => {
        console.log("Sing up", values);
        setSubmitting(false);
        setSignInFlag({ 
          signIn: true, 
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword
        });
      }}
      
      validationSchema = { Yup.object().shape({
        name: Yup.string()
          .required("Requerido")
          .matches(/^([A-Z][a-zA-Z]*)$/, "Nombre inválido"),
        lastname: Yup.string()
          .required("Requerido")
          .matches(/^([A-Z][a-zA-Z]*)$/, "Apellido inválido"),
        email: Yup.string("Email inválido")
          .email("Formato inválido")
          .required("Requerido"),
        password: Yup.string("Contraseña inválida")
          .required("Requerido")
          .min(8, "Contraseña muy corta - Debe contener al menos 8 caracteres")
          .matches(/(?=.*[0-9])/, "Debe contener al menos un número"),
        confirmPassword: Yup.string("Confirmación inválida")
          .required("Requerido")
          .oneOf([Yup.ref('password'), null], 'Contraseñas deben ser iguales')
      }) }
    >
    { props => {
        const {
          values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit
        } = props;
        return (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Nombre"
                  autoFocus
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name && "error"}
                />
                {errors.name && touched.name && (
                  <div>{errors.name}</div>
                )}
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastname"
                  label="Apellido"
                  name="lastname"
                  autoComplete="lname"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.lastname && touched.lastname && "error"}
                />
                {errors.lastname && touched.lastname && (
                  <div>{errors.lastname}</div>
                )}

              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email && "error"}
                />
                {errors.email && touched.email && (
                  <div>{errors.email}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password && "error"}
                />
                {errors.password && touched.password && (
                  <div>{errors.password}</div>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword && touched.confirmPassword && "error"}

                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div>{errors.confirmPassword}</div>
                )}
              </Grid>

            </Grid>
            <br />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={() => {
                setSignInFlag(true)
                handleClickSignUp
              }}
            >
              Registrarme
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  ¿Ya tienes cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
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
          </form>
        );
    }}
    </Formik>
  );
}

const NORMAL_REGISTER_USER = gql`
mutation($name: String!, $lastname: String!, $email: String!, $password: String!, $confirmPassword: String!) {
  createUserFromNormalSignUp(name: $name, lastName: $lastname, email: $email, password: $password, confirmPassword: $confirmPassword) {
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