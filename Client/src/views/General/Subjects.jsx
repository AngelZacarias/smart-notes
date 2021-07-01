import React, { useEffect, useState } from "react";
//Graphql
import { useQuery, useLazyQuery, gql } from '@apollo/client';
// material-ui components
import { makeStyles, Grid, Fab, Button, LinearProgress } from "@material-ui/core";
import { Add, School } from "@material-ui/icons";
// template components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

//Our components
import SubjectForm from './SubjectForm';

const useStyles = makeStyles(() => ({
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
}));

const Subjects = () => {
    const classes = useStyles();
    
    //State
    const[subjectFormShow, setSubjectFormShow] = useState(false);
    const[subject, setSubject] = useState({
        id: "",
        name: "",
        days: [],
        startHour: "",
        endHour: "",
        color: "rose",
    });

    //Gets all the active subjects for this user
    const{data:subjects, loading} = useQuery(GET_SUBJECTS, {
      context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), // "| GOOGLE_TOKEN"
        }
      }
    });
    //Gets all the information for the selected subject
    const[getSelectedSubject, {data:selectedSubject, loadingSubject}] = useLazyQuery(GET_SELECTED_SUBJECT, {
        context: {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), // "| GOOGLE_TOKEN"
          }
        }
      });

    const handleOpenSubject = (id) =>{
        console.log("Selected to open: ",id);
    }

    //Open the subject form to edit or delete the current subject
    const handleEditSubject = (id) => {
        const getSubject = async() => {
            getSelectedSubject({
                variables:{
                    subjectId: id,
                },
            });
        }
        getSubject();
        //Shows the form modal
        setSubjectFormShow(!subjectFormShow);
    }
    //Fill the subject object when the response is back
    useEffect(()=>{
        if(!loadingSubject && selectedSubject && selectedSubject.getSubject){
            //Gets an array of selected Days
            const selectedDays = selectedSubject.getSubject.schedule.map(sch => sch.dayOfWeek);
            //Sets the info
            setSubject({
                id: selectedSubject.getSubject.id,
                name: selectedSubject.getSubject.name,
                days: selectedDays,
                startHour: selectedSubject.getSubject.schedule[0].startHour,
                endHour: selectedSubject.getSubject.schedule[0].endHour,
                color: selectedSubject.getSubject.color,
            });
        }
    },[selectedSubject]);

    //Open the Subject Form to create a new one
    const handleClickSubjectForm = () =>{
        //Clears the State for the Subject
        setSubject({
            id: "",
            name: "",
            days: [],
            startHour: "",
            endHour: "",
            color: "rose",
        });
        //Shows the form modal
        setSubjectFormShow(!subjectFormShow);
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
                    subjects && subjects.getMyCurrentSubjects ?
                        subjects.getMyCurrentSubjects.map(subject=>(
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
                <Fab color="primary" 
                    aria-label="add" 
                    className={classes.fab}
                    onClick={handleClickSubjectForm}
                >
                    <Add/>
                </Fab>
            </div>
            <SubjectForm
                showForm={subjectFormShow}
                handleClose={setSubjectFormShow}
                subject={subject}
                setSubject={setSubject}
            />
        </div>
     );
}

export const GET_SUBJECTS = gql`
query{
  getMyCurrentSubjects{
    id
    name
    color
    numberOfPendingTasks
  }
}
`;

export const GET_SELECTED_SUBJECT = gql`
query getSelectedSubject($subjectId: ID!){
  getSubject(subjectId: $subjectId){
    id,
    name,
    color,
    schedule{
      dayOfWeek,
      startHour,
      endHour,
    }
  }
}
`;
 
export default Subjects;