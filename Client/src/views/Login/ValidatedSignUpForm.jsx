import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import React from "react";
import { Formik } from "formik" ;
import * as Yup from "yup";
import Link from '@material-ui/core/Link';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useEffect, useState } from "react";

export default function ValidatedSignUpForm() {
  const [sendMutationSignIn, {data: userDataResponse }] = useMutation(NORMAL_REGISTER_USER);
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

  useEffect(() => {
    if(signInFlag.signIn) {
      sendMutationSignIn({ //Checar por qué no funciona esta parte, no toma los valores
        variables: {
          name: signInFlag.name,
          lastname: signInFlag.lastname,
          email: signInFlag.email,
          password: signInFlag.password,
          confirmPassword: signInFlag.confirmPassword
        }
      }).then(data => {
        alert("User created:", data)
      }).catch(err => {
        alert(err);
      });
      setSignInFlag({signIn: false});
    }
  }, [signInFlag]);

  useEffect(() => {
    console.log(userDataResponse)
  }, [userDataResponse]);
  return (
    <Formik
      initialValues={{name: "", lastname: "", email: "", password: "", confirmPassword: ""}}
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          console.log("Sing up", values);
          setSubmitting(false);
          //aqui poner la bandera setsomething signInEvent
          setSignInFlag({ 
            signIn: true, //Aunque yo ponga esta bandera, no funciona, me da status 400 en el alert. El backend funciona bien. Investigar
            name: values.name,
            lastname: values.lastname,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
          })
        }, 500);
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
              onClick={() => setSignInFlag(true)}
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
          </form>
        );
    }}
    </Formik>
  );
}

const NORMAL_REGISTER_USER = gql`
mutation($name: String!, $lastName: String!, $email: String!, $password: String!, $confirmPassword: String!) {
  createUserFromNormalSignUp(name: $name, lastName: $lastName, email: $email, password: $password, confirmPassword: $confirmPassword) {
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