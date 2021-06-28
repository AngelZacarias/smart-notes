import React, { useState, useEffect } from 'react'
import { 
		makeStyles, 
		Modal, 
		Paper, 
		Typography,
		TextField,
		FormControl ,
} from "@material-ui/core";
import PropTypes from "prop-types";
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import * as Yup from "yup";

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

	const[sendMutationSaveProfile, { data: savedProfileResponse }] = useMutation(EDIT_PROFILE);
	const [saveProfile, setSaveProfile] = useState(false);

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

	// const [showMessage, setShowMessage] = useState(false);
  // const [message, setMessage] = useState("");

  // const handleClickSaveProfile = () => {
  //   setShowMessage(true);
  // }

  // const handleCloseMessage = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return
  //   }
  //   setShowMessage(false);
  // }

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
				console.log(error);
				// setMessage(error.graphQLErrors[0].message)
				// setShowMessage(true)
			});
			//Quizá lo siguiente produzca un (ERROR) borrado del perfil? Analizar
			setProfile({
				bio: "",
				carrer: "",
				facebookURL: "",
				linkedinURL: "",
				twitterURL: ""
			});
			setSaveProfile(false);
			// console.log("ESTO VALE AHORA profile: ", profile);
			// console.log("ESTO VALE AHORA saveProfile: ", saveProfile);
		}
	}, [profile, saveProfile]);



	useEffect(() => {
		console.log(savedProfileResponse);
	}, [savedProfileResponse]);

	//Quizás voy a tener que quitar esto
	// const handleChangeProfileValue = (e) =>{
	// 	setProfile({
	// 		// ...profile,
	// 		[e.target.name]: e.target.value,
	// 		[e.target.name]: e.target.value,
	// 		[e.target.name]: e.target.value,
	// 		[e.target.name]: e.target.value,
	// 		[e.target.name]: e.target.value,
	// 	})
	// 	console.log(profile);
	// }

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
				// setProfile({
				// 	bio: values.bio,
				// 	carrer: values.carrer,
				// 	facebookURL: values.facebookURL,
				// 	linkedinURL: values.linkedinURL,
				// 	twitterURL: values.twitterURL
				// });
				// console.log("ESTO VALE AHORA profile: ", values);

				// setSaveProfile(true); //quizá quitar esto
			}}

			validationSchema = { Yup.object().shape({
				bio: Yup.string(),
				carrer: Yup.string()
					.required("Requerido"),
				facebookURL: Yup.string(),
				linkedinURL: Yup.string(),
				twitterURL: Yup.string(),
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
									variant="contained"
									color="primary"
									size="large"
									className={classes.button}
									startIcon={<SaveIcon />}
									disabled={isSubmitting}
									onClick={() => {
										setProfile({
											bio: values.bio,
											carrer: values.carrer,
											facebookURL: values.facebookURL,
											linkedinURL: values.linkedinURL,
											twitterURL: values.twitterURL
										});
										setSaveProfile(true)
									}}
								>
									Guardar información
								</Button>
							</FormControl>  
						</form>
							</Paper>
						</Modal>
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