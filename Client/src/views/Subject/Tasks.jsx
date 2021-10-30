import { gql, useQuery, useMutation } from '@apollo/client';
// import { Fab } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import { Add } from "@material-ui/icons";
import { Alert, AlertTitle } from '@material-ui/lab';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { SubjectContext } from './../../hooks/SubjectContext';
// import Checkbox from '@material-ui/core/Checkbox';
import TaskForm from "./Tasks/TaskForm";
import TaskEditForm from "./Tasks/TaskEditForm";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    display: "flex",
  }
});

export default function Tasks() {
  const [rows, setTableRows] = useState([]);
  const [taskToDeleteId, setTaskToDeleteId] = useState("");
  const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [deleteTask, setDeleteTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState({
    assignment: "",
    description: "",
    deadline: "",
    active: true,
  });
  const [taskEditFormShow, setTaskEditFormShow] = useState(false);


  const classes = useStyles();

	const { subjectInformation } = useContext(SubjectContext);

	const { data: tasksInfo, loading, error, called } = useQuery(GET_CURRENT_TASKS, {
    variables: { subjectId: subjectInformation.id },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }
    },
    fetchPolicy: "cache-and-network",
  });

  const [sendMutationDeleteTask, { data: deletedTaskResponse }] = useMutation(DELETE_TASK, {
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
  });

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShowMessage(false);
  }

  const handleClickOpenAlertMessage = (task) => 
  {
    console.log("Selected to delete: ", task.id);
    setTaskToDeleteId(task.id);
    setOpenAlertMessage(true);
  };

  const handleCloseAlertMessage = () => {
    setOpenAlertMessage(false);
  };

  const handleClickEditTaskForm = (task) => {
    setTaskToEdit(task);
    setTaskEditFormShow(true)
  }

  useEffect(() => {
    console.log("Valor de: deleteTask", deleteTask);
    if (deleteTask == true) {
      sendMutationDeleteTask({
        variables: {
          taskId: taskToDeleteId
        }
      }).catch(error => {
				console.log("Error aqui", error);
        setMessage(error);
				setShowMessage(true);
      })
      setTaskToDeleteId("");
      setDeleteTask(false);
    }

  }, [deleteTask]);

	useEffect(() => {
		if (tasksInfo) {
			// console.log(tasksInfo);
      setTableRows([...tasksInfo.getMyCurrentTasks])
		}
		if (error) {
			console.log(error);
		}
	}, [tasksInfo, error]);

  useEffect(() => {
    if (deletedTaskResponse) {
      console.log(deletedTaskResponse);
			setMessage("Tarea eliminada")
			setShowMessage(true)
    }
  }, [deletedTaskResponse]);


  return (
	<Fragment>
    {
      // Validations for the query
      loading ?
        <LinearProgress />
      : error && error.message ?
          <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>Ocurrió un error al obtener las tareas</strong> - {error.message}
          </Alert>
      : !loading && called && tasksInfo.getMyCurrentTasks.length < 1 ?
          <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              No pudimos encontrar ninguna coincidencia... ¡Crea una nueva tarea pendiente!
          </Alert>
      :
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={subjectInformation.color}>
              <h4 className={classes.cardTitleWhite}>Tareas pendientes</h4>
              <p className={classes.cardCategoryWhite}>
              Aquí se visualizan las tareas pendientes asignadas a tu materia
              </p>
            </CardHeader>
            <CardBody>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell key="name">Nombre</TableCell>
                      <TableCell key="description" align="left">Descripción</TableCell>
                      <TableCell key="deadline" align="center">Fecha de entrega</TableCell>
                      {/* <TableCell key="active" align="left">Completada</TableCell> */}
                      <TableCell key="actions" align="left">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.assignment}>
                        <TableCell key={row.assignment} component="th" scope="row">
                          {row.assignment}
                        </TableCell>
                        <TableCell key={row.description} align="left">{row.description}</TableCell>
                        <TableCell key={row.deadline} align="center">{row.deadline}</TableCell>
                        {/* <TableCell align="center">
                          <Checkbox
                            checked={row.active}
                            // onChange={}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                        </TableCell> */}
                        <TableCell key="actions" align="center">
                          <div className={classes.container}>
                            <IconButton 
                              aria-label="edit" 
                              color="primary"
                              onClick={() => {
                                // console.log("esto vale row:", row);
                                handleClickEditTaskForm(row)
                              }}
                            >
                                <EditIcon />
                            </IconButton>
                            {/* <IconButton aria-label="delete"
                              onClick={() => handleDeleteTask(row)}
                            > */}
                            <IconButton aria-label="delete"
                              onClick={() => handleClickOpenAlertMessage(row)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    }
		<TaskForm
			
		/>
    <TaskEditForm
      showEditForm={taskEditFormShow}
      handleCloseEditFormShow={setTaskEditFormShow}
      task={taskToEdit}
    />
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
    <div>
      <Dialog
        open={openAlertMessage}
        onClose={handleCloseAlertMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Estás seguro de eliminar la tarea?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se eliminará la tarea. Este cambio no se podrá deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertMessage} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
            setDeleteTask(true)
            setOpenAlertMessage(false)
          }} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
	</Fragment>
  );
}

export const GET_CURRENT_TASKS = gql`
query getMyCurrentTasks($subjectId: ID!) {
	getMyCurrentTasks(subjectId: $subjectId) {
		id,
		assignment,
		description,
		deadline,
		active,
		user {
			id,
			name,
			lastName,
			email
		},
		subject {
			id,
			name,
			color,
		},
	}
}
`

const DELETE_TASK = gql`
  mutation($taskId: ID!) {
    deleteTask(taskId: $taskId) 
  }

`