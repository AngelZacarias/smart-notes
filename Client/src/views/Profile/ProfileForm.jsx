import { gql, useMutation } from '@apollo/client';
import {
	FormControl, IconButton, makeStyles,
	Modal,
	Paper, Snackbar, TextField, Typography
} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from '@material-ui/icons/Save';
import { Formik } from 'formik';
import PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { GET_PROFILE_BY_ID, getIdParameter } from "./MiddleDivider";


const useStyles = makeStyles((theme) => ({
		poperContainer:{
				height: '600px',
				width: '500px',
				backgroundColor: theme.palette.background.paper,
				alignItems: 'center',
				margin: theme.spacing(2),
		},
		rootContainer: {
				display: 'flex',
				flexWrap: 'wrap',
		},
		title:{
				margin: theme.spacing(3),
				alignItems: 'center',
		},
		margin: {
				margin: theme.spacing(3),
		},
}));

const ProfileForm = ({showForm, handleClose}) => {
	const classes = useStyles();

	const handleClickSaveProfile = () => {
    setShowMessage(true)
  }

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }

	const [saveProfile, setSaveProfile] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
	const[sendMutationSaveProfile, { data: savedProfileResponse }] = useMutation(EDIT_PROFILE, {
		context: {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
			}
		},
		refetchQueries: [{ 
			query: GET_PROFILE_BY_ID, 
      variables: { userId: getIdParameter() },
      //aqui me falto llamar a la funcion para obtener las "variables" userId
			context: {
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
				} 
			}

		}],
		awaitRefetchQueries: true,
	});

	//State for inputs values
	const [profile, setProfile] = useState(
		{
			bio: "",
			carrer: "",
			facebookURL: "",
			linkedinURL: "",
			twitterURL: "",
		}
	);

	useEffect(() => {
		if (saveProfile) {
			console.log("Profile Data: ", profile);
			
			sendMutationSaveProfile({
				variables: {
					bio: profile.bio,
					carrer: profile.carrer,
					facebookURL: profile.facebookURL,
					linkedinURL: profile.linkedinURL,
					twitterURL: profile.twitterURL
				}
			}).catch(error => {
				console.log("Error aqui", error);
				setMessage("Algo salió mal");
				setShowMessage(true);
			});
			setProfile({
				bio: "",
				carrer: "",
				facebookURL: "",
				linkedinURL: "",
				twitterURL: ""
			});
			setSaveProfile(false);
		}
	}, [profile, saveProfile]);

	useEffect(() => {
		if (savedProfileResponse) {
			console.log(savedProfileResponse);
			setMessage("Perfil guardado exitosamente")
			setShowMessage(true)
		}
	}, [savedProfileResponse]);

	return (
		<Formik
			initialValues={{
				bio: "",
				carrer: "",
				facebookURL: "",
				linkedinURL: "",
				twitterURL: "",
			}}
			onSubmit={ (values, { setSubmitting }) => {
				console.log("Editando", values);
				setSubmitting(false);
			}}
			validationSchema = { Yup.object().shape({
				bio: Yup.string(),
				carrer: Yup.string()
					.required("Requerido"),
				facebookURL: Yup
          .string()
          .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'URL incorrecto'
          )
          .required("Requerido"),
				linkedinURL: Yup
          .string()
          .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'URL incorrecto'
          )
          .required("Requerido"),
				twitterURL: Yup
          .string()
          .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'URL incorrecto'
          )
          .required("Requerido"),
			}) }
		>
		{ props => {
				const {
					values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit
				} = props;
				return (
					<form noValidate onSubmit={handleSubmit}>
						<Modal
							open={showForm}
							onClose={()=>handleClose(!showForm)}
						>
						<Paper className={classes.poperContainer}
							style={{
								position: 'fixed',
								bottom: '8%',
								right: '2%',
							}}
						>
						<form className={classes.rootContainer}>
							<FormControl fullWidth className={classes.title}>
								<Typography variant="h5">
									EDITAR PERFIL
								</Typography>
							</FormControl >
							<FormControl fullWidth className={classes.margin}>
								<TextField 
									variant="outlined" 
									label="Descripción"
									name="bio"
									id="bio" 
									value={values.bio}
									onChange={handleChange}
									onBlur={handleBlur}
                  className={errors.bio && touched.bio && "error"}
								/>
                {errors.bio && touched.bio && (
                  <div>{errors.bio}</div>
                )}
								<br/>
								<TextField 
									variant="outlined" 
									label="Carrer"
									name="carrer" 
									id="carrer"
									value={values.carrer}
									onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.carrer && touched.carrer && "error"}
								/>
                {errors.carrer && touched.carrer && (
                  <div>{errors.carrer}</div>
                )}
								<br/>			
								<TextField 
									variant="outlined" 
									label="Facebook URL"
									name="facebookURL"
									id="facebookURL" 
									value={values.facebookURL}
									onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.facebookURL && touched.facebookURL && "error"}
								/>
                {errors.facebookURL && touched.facebookURL && (
                  <div>{errors.facebookURL}</div>
                )}
								<br/>
								<TextField 
									variant="outlined" 
									label="LinkedIn URL"
									name="linkedinURL" 
									id="linkedinURL"
									value={values.linkedinURL}
									onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.linkedinURL && touched.linkedinURL && "error"}
								/>
                {errors.linkedinURL && touched.linkedinURL && (
                  <div>{errors.linkedinURL}</div>
                )}	
								<br/>
								<TextField 
									variant="outlined" 
									label="Twitter URL"
									name="twitterURL" 
									id="twitterURL"
									value={values.twitterURL}
									onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.twitterURL && touched.twitterURL && "error"}
								/>
                {errors.twitterURL && touched.twitterURL && (
                  <div>{errors.twitterURL}</div>
                )}	
								<br />
								<Button
                  type="submit"
									variant="contained"
									color="primary"
									size="large"
									className={classes.button}
									startIcon={<SaveIcon />}
									disabled={isSubmitting}
									onClick={() => {
										setSaveProfile(true)
										handleClickSaveProfile
										handleClose(!showForm)
                    setProfile({
                      bio: values.bio,
                      carrer: values.carrer,
                      facebookURL: values.facebookURL,
                      linkedinURL: values.linkedinURL,
                      twitterURL: values.twitterURL
                    });
									}}
								>
									Guardar información
								</Button>
							</FormControl>  
						</form>
							</Paper>
						</Modal>
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
			}
		}
		</Formik>
	);
}

export default ProfileForm;

ProfileForm.propTypes = {
	showForm: PropTypes.bool,
	handleClose: PropTypes.func,
};

const EDIT_PROFILE = gql`
	mutation($bio: String, $carrer: String, $facebookURL: String, $linkedinURL: String, $twitterURL: String) {
		editProfile(bio: $bio, carrer: $carrer, facebookURL: $facebookURL, linkedinURL: $linkedinURL, twitterURL: $twitterURL) {
			bio,
			carrer,
			facebookURL,
			linkedinURL,
			twitterURL
		}
	}
`;