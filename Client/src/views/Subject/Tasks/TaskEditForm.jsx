import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Snackbar, IconButton } from "@material-ui/core";
import { Formik } from 'formik';
import * as Yup from "yup";
import { TextField, makeStyles, FormControl } from "@material-ui/core";
import { SubjectContext } from './../../../hooks/SubjectContext';
import { gql, useMutation } from '@apollo/client';
import { GET_CURRENT_TASKS } from "../Tasks";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";


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
      margin: theme.spacing(3),
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

const TaskEditForm = ({ showEditForm, handleCloseEditFormShow, task}) => {
	const classes = useStyles();

	// const [taskFormShow, setTaskFormShow] = useState(false);
  const [editTask, setEditTask] = useState(false);
	const { subjectInformation } = useContext(SubjectContext);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
  
  const [sendMutationEditTask, { data: editedTaskResponse }] = useMutation(EDIT_TASK, {
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

  // const handleClickTaskForm = () => {
	// 	setEditedTask({
	// 		assignment: "",
	// 		description: "",
	// 		deadline: "",
	// 		active: true,
	// 	});
	// 	setTaskFormShow(!taskFormShow);
	// }

  const [editedTask, setEditedTask] = useState({
		assignment: task.assignment,
		description: task.description,
		deadline: task.deadline,
		active: task.active,
    id: task.id,
	})

  // const handleCloseEditFormShow = () => {
  //   setTaskFormShow(!taskFormShow);
  //   console.log(task);
  // };

  const handleChangeTaskValue = (e) => {
    console.log("task:", task)
    console.log(e.target.value);
    setEditedTask({
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
    if (editTask) {
      console.log("Edited Task Data: ", editedTask);
      sendMutationEditTask({
        variables: {
          assignment: editedTask.assignment,
          description: editedTask.description,
          deadline: editedTask.deadline,
          active: true,
          subjectId: subjectInformation.id,
          taskId: editedTask.id
        }
      }).catch(error => {
				console.log("Error aqui", error);
				setMessage(error);
				setShowMessage(true);
			});
      setEditedTask({
        assignment: "",
        description: "",
        deadline: "",
        active: true,
      });
      setEditTask(false);
    }
  }, [editedTask, editTask]);

  useEffect(() => {
		if (editedTaskResponse) {
			console.log(editedTaskResponse);
			setMessage("Tarea guardada exitosamente")
			setShowMessage(true)
		}
	}, [editedTaskResponse]);

  return (
    <div>
      <Formik
        initialValues={{
          assignment: "",
          description: "",
          deadline: "",
          active: true,
        }}
        onSubmit={ (values, { setSubmitting }) => {
          console.log("Creando", values);
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
                open={showEditForm}
                onClose={() => handleCloseEditFormShow(!showEditForm)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.poperContainer}

              >
                <DialogTitle id="alert-dialog-title">{"EDITAR TAREA PENDIENTE"}</DialogTitle>
                <DialogContent
                  className={classes.rootContainer}
                >
                  <DialogContentText id="alert-dialog-description">
                    En este espacio puedes editar tu nueva tarea pendiente, recuerda asignarle una fecha de entrega para recibir notificación por correo sobre la entrega próxima.
                  </DialogContentText>
                  <FormControl fullWidth className={classes.title && classes.input}>
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
                    <br/>

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
                    <br/>
                    <TextField
                        id="deadline"
                        variant="outlined"
                        label="Fecha de entrega"
                        name="deadline"
                        value={editedTask.deadline}
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
                      handleCloseEditFormShow(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    disabled={isSubmitting}
                    onClick={() => {
                      setEditTask(true)
                      handleClickSaveTask
                      setEditedTask({
                        assignment: values.assignment,
                        description: values.description,
                        deadline: editedTask.deadline,
                        active: true,
                        id: editedTask.id,
                      });
                      handleCloseEditFormShow(false)
                    }} 
                    color="primary" 
                    autoFocus
                  >
                    Editar
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
                    <IconButton>
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

export default TaskEditForm;

TaskEditForm.propTypes = {
  open: PropTypes.bool,
  handleCloseEditFormShow: PropTypes.func,
  task: PropTypes.object,
}

const EDIT_TASK = gql`
  mutation($assignment: String!, $description: String!, $deadline: String!, $subjectId: ID!, $taskId: ID!) {
    editTask(assignment: $assignment, description: $description, deadline: $deadline, subjectId: $subjectId, taskId: $taskId)
  }
`;
