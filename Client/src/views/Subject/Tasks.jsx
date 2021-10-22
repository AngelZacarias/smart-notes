import { gql, useQuery } from '@apollo/client';
import { Fab } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Add } from "@material-ui/icons";
import { Alert, AlertTitle } from '@material-ui/lab';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { SubjectContext } from './../../hooks/SubjectContext';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];


export default function Tasks() {
  const [rows, setTableRows] = useState([]);

  const classes = useStyles();

	const { subjectInformation } = useContext(SubjectContext);

	const { data: tasksInfo, loading, error, called } = useQuery(GET_CURRENT_TASKS, {
    variables: { subjectId: subjectInformation.id },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }
    }
  });

	useEffect(() => {
		if (tasksInfo) {
			console.log(tasksInfo);
      setTableRows([...tasksInfo.getMyCurrentTasks])
		}
		if (error) {
			console.log(error);
		}
	}, [tasksInfo, error])

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
            <CardHeader color="primary">
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
                      <TableCell key="active" align="left">Activo</TableCell>
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
                        <TableCell align="center">
                          <Checkbox
                            checked={row.active}
                            // onChange={}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
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
		<Fab color="primary" 
			aria-label="add" 
			className={classes.fab}
			// onClick={handleClickSubjectForm}
		>
			<Add/>
		</Fab>
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