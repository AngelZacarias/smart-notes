import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Fab, Snackbar, IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Formik } from 'formik';
import * as Yup from "yup";
import { TextField, makeStyles, FormControl } from "@material-ui/core";
import { SubjectContext } from './../../../hooks/SubjectContext';
import { gql, useMutation } from '@apollo/client';
import { GET_CURRENT_TASKS } from "../Tasks";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";



const useStyles = makeStyles((theme) => ({
  poperContainer:{
      height: '600px',
      width: '500px',
      // backgroundColor: theme.palette.background.paper,
      alignItems: 'center',
      margin: theme.spacing(40),
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
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
  },
  input: {
      width: '380px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function AlertDialog() {
	const classes = useStyles();

	const [taskFormShow, setTaskFormShow] = useState(false);
  const [saveTask, setSaveTask] = useState(false);
	const {subjectInformation } = useContext(SubjectContext);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
  
  const [sendMutationSaveTask, { data: savedTaskResponse }] = useMutation(CREATE_TASK, {
    context: {
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
			}
		},
    refetchQueries: [{ 
			query: GET_CURRENT_TASKS, 
      variables: { subjectId: subjectInformation.id },
      context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
        }
      },
      fetchPolicy: "cache-and-network",
		}],
		awaitRefetchQueries: true,
  })

  const handleClickTaskForm = () => {
		setTask({
			assignment: "",
			description: "",
			deadline: "",
			active: true,
		});
		setTaskFormShow(!taskFormShow);
	}

  const [task, setTask] = useState({
		assignment: "",
		description: "",
		deadline: "",
		active: true,
	})

  const handleClose = () => {
    setTaskFormShow(!taskFormShow);
    // console.log(task);
  };

  const handleChangeTaskValue = (e) => {
    // console.log("task:", task)
    // console.log(e.target.value);
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  }

  const handleClickSaveTask = () => {
    setShowMessage(true)
  }

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }

  useEffect(() => {
    if (saveTask) {
      // console.log("Task Data: ", task);
      sendMutationSaveTask({
        variables: {
          assignment: task.assignment,
          description: task.description,
          deadline: task.deadline,
          active: true,
          subjectId: subjectInformation.id
        }
      }).catch(error => {
				console.log("Error aqui", error);
				setMessage("Campos inválidos");
				setShowMessage(true);
			});
      setTask({
        assignment: "",
        description: "",
        deadline: "",
        active: true,
      });
      setSaveTask(false);
    }
  }, [task, saveTask]);

  useEffect(() => {
		if (savedTaskResponse) {
			// console.log(savedTaskResponse);
			setMessage("Tarea guardada exitosamente")
			setShowMessage(true)
		}
	}, [savedTaskResponse]);

  return (
    <div>
      <Fab color="primary" 
        aria-label="add" 
        onClick={handleClickTaskForm}
      >
        <Add/>
      </Fab>
      <Formik
        initialValues={{
          assignment: "",
          description: "",
          deadline: "",
          active: true,
        }}
        onSubmit={ (values, { setSubmitting }) => {
          // console.log("Creando", values);
          setSubmitting(false);
        }}
        validationSchema = { Yup.object().shape({
          assignment: Yup.string()
            .required("Requerido"),
          description: Yup.string(),
          deadline: Yup.string()
            .required("Requerido"),
          active: Yup.boolean()
        })}
      >
      {
        props => {
          const {
            values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit
          } = props;
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Dialog
                open={taskFormShow}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                scroll="body"
                fullWidth={true}
                maxWidth={'sm'}
              >
                <DialogTitle>CREAR TAREA PENDIENTE</DialogTitle>
                <DialogContent
                  className={classes.rootContainer}
                >
                  <DialogContentText>
                    En este espacio puedes crear tu nueva tarea pendiente, recuerda asignarle una fecha de entrega para recibir notificación por correo sobre la entrega próxima.
                  </DialogContentText>
                  <FormControl fullWidth className={classes.margin} variant="outlined">
                    <TextField 
                      variant="outlined" 
                      label="Tarea"
                      name="assignment"
                      id="assignment" 
                      value={values.assignment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.assignment && touched.assignment && "error"}
                    />
                    {errors.assignment && touched.assignment && (
                      <div>{errors.assignment}</div>
                    )}
                  </FormControl>
                  <FormControl fullWidth className={classes.margin} variant="outlined">
                    <TextField 
                      variant="outlined" 
                      label="Descripción"
                      name="description"
                      id="description" 
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.description && touched.description && "error"}
                    />
                    {errors.description && touched.description && (
                      <div>{errors.description}</div>
                    )}
                  </FormControl>
                  <FormControl fullWidth className={classes.margin} variant="outlined">
                    <TextField
                        id="deadline"
                        variant="outlined"
                        label="Fecha de entrega"
                        name="deadline"
                        value={task.deadline}
                        onChange={handleChangeTaskValue}
                        type="datetime-local"
                        // defaultValue="2021-01-01T07:00"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                    />
                    {errors.deadline && touched.deadline && (
                      <div>{errors.deadline}</div>
                    )}

                  </FormControl >
                </DialogContent>
                <DialogActions>
                  <Button 
                    color="secondary" 
                    onClick={()=> {
                      setTaskFormShow(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    disabled={isSubmitting}
                    onClick={() => {
                      setSaveTask(true)
                      handleClickSaveTask
                      setTask({
                        assignment: values.assignment,
                        description: values.description,
                        deadline: task.deadline,
                        active: true
                      });
                      setTaskFormShow(false)
                    }} 
                    color="primary" 
                    autoFocus
                  >
                    Crear
                  </Button>
                </DialogActions>
              </Dialog>        
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
    </div>
  );
}

const CREATE_TASK = gql`
  mutation($assignment: String!, $description: String!, $deadline: String!, $subjectId: ID!) {
    createTask(assignment: $assignment, description: $description, deadline: $deadline, subjectId: $subjectId) {
      assignment,
      description,
      deadline,
      active
    }
  }
`;
