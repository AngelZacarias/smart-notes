import React, { useEffect } from "react";
//Graphql
import { useQuery, gql } from '@apollo/client';
// material-ui components
import { makeStyles, Grid, Fab, Button, LinearProgress } from "@material-ui/core";
import { Add, School } from "@material-ui/icons";
// template components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const styles = {
    ...dashboardStyle,
    cardTitle: {
      marginTop: "0",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
    fab: {
        position: 'absolute',
        bottom: "20px",
        right: "20px",
    },
};

const useStyles = makeStyles(styles);

const Subjects = () => {
    const classes = useStyles();

    //State for Query
    const{data:subjects, loading} = useQuery(GET_SUBJECTS, {
      context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN" | "GOOGLE_TOKEN"),
        }
      }
    });

    useEffect(()=>{
        console.log(subjects)
    },[subjects]);

    const handleEditSubject = (id) =>{
        console.log("Selected for edit: ",id);
    }

    const handleOpenSubject = (id) =>{
        console.log("Selected to open: ",id);
    }

    return ( 
        <div>
            {
                loading ?
                    <LinearProgress />
                : 
                    null
            }
            <Grid container spacing={5}>
                {
                    subjects && subjects.getSubjects ?
                        subjects.getSubjects.map(subject=>(
                            <Grid item xs={6} sm={3} key={subject.id}>
                                <Card>
                                    <CardHeader color={subject.color}>
                                        <h4 className={classes.cardTitle}> 
                                            <School/> 
                                            {" "+ subject.name}
                                        </h4>
                                    </CardHeader>
                                    <CardBody>
                                        <p>No hay tareas pendientes...</p>
                                    </CardBody>
                                    <CardFooter chart>
                                        <Grid container justify="space-between" alignItems="center">
                                            <Grid item>
                                                <Button 
                                                    color="secondary"
                                                    onClick={()=>handleEditSubject(subject.id)}
                                                >
                                                    Editar
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button 
                                                    color="secondary"
                                                    onClick={()=>handleOpenSubject(subject.id)}
                                                >
                                                    Abrir Materia
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardFooter>
                                </Card>
                            </Grid>
                        ))
                    : null
                }
                
            </Grid>
            <div>
                <Fab color="primary" aria-label="add" className={classes.fab}>
                    <Add/>
                </Fab>
            </div>
        </div>
     );
}

const GET_SUBJECTS = gql`
query{
  getSubjects{
    id
    name
    color
  }
}
`;
 
export default Subjects;