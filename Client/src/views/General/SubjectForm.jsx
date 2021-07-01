import React, { useState, useEffect } from 'react'
import { 
    makeStyles, 
    Modal, 
    Paper, 
    Typography,
    TextField,
    FormControl,
    FormLabel,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Button,
} from "@material-ui/core";
import { gql, useMutation } from '@apollo/client';
import ColorSelector from '../../components/Colors/ColorSelector';
import PropTypes from "prop-types";
import { GET_SUBJECTS } from './Subjects';

const useStyles = makeStyles((theme) => ({
    poperContainer:{
        height: '600px',
        width: '550px',
        backgroundColor: theme.palette.background.paper,
        alignItems: 'center',
        margin: theme.spacing(1),
    },
    rootContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    title:{
        margin: theme.spacing(1),
        alignItems: 'center',
    },
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
}));

const SubjectForm = ({ showForm, handleClose, subject, setSubject }) => {
    const classes = useStyles();

    //:::::::::: MUTATIONS ::::::::::::
    //CREATE SUBJECT
    const [createSubject, { data: subjectDataCreated }] = useMutation(CREATE_SUBJECT, {
        context: {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
            }
        },
        refetchQueries:[{
            query: GET_SUBJECTS,
            context:{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
                }
            }
        }],
        awaitRefetchQueries: true,
    });
    //UPDATE SUBJECT
    const [updateSubject, { data: subjectDataUpdated }] = useMutation(UPDATE_SUBJECT, {
        context: {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
            }
        },
        refetchQueries:[{
            query: GET_SUBJECTS,
            context:{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
                }
            }
        }],
        awaitRefetchQueries: true,
    });
    //DELETE SUBJECT
    const [deleteSubject, { data: subjectDataDeleted }] = useMutation(DELETE_SUBJECT, {
        context: {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
            }
        },
        refetchQueries:[{
            query: GET_SUBJECTS,
            context:{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
                }
            }
        }],
        awaitRefetchQueries: true,
    });

    //State for inputs values
    const [daysOfWeek, setDaysOfWeek] = useState([
        { day: "Lu", value: false, dayOfWeek: 1 },
        { day: "Ma", value: false, dayOfWeek: 2 },
        { day: "Mi", value: false, dayOfWeek: 3 },
        { day: "Ju", value: false, dayOfWeek: 4 },
        { day: "Vi", value: false, dayOfWeek: 5 },
        { day: "Sa", value: false, dayOfWeek: 6 },
        { day: "Do", value: false, dayOfWeek: 0 },
    ]);
    const [selectedColorValue, setselectedColorValue] = useState(subject.color);

    //Initialize the component Inputs (color and selected days) when the user is set
    useEffect(()=>{
        setselectedColorValue(subject.color);
        const selectedDaysOfWeek = daysOfWeek.map(day =>
            ({...day, value: subject.days.includes(day.dayOfWeek)})
        )
        setDaysOfWeek(selectedDaysOfWeek);
    },[subject]);
    
    // Change the state
    const handleChangeSubjectValue = (e) =>{
        setSubject({
            ...subject,
            [e.target.name]: e.target.value,
        });
    }
    const handleSelectDays = (e) =>{
        const numberOfDay = parseInt(e.target.name, 10);

        let newSelectedDays = [...subject.days];
        const index = newSelectedDays.indexOf(numberOfDay);
        if(index !== -1){
            //Delete the selected day
            newSelectedDays = newSelectedDays.filter(value => value !== numberOfDay )
        }
        else {
            //Adds the selected day
            newSelectedDays = [...newSelectedDays, numberOfDay];
        }
        //Updates the state for the subject
        setSubject({
            ...subject,
            days: newSelectedDays,
        });
    }

    //Updates the state of the subject object
    useEffect(()=>{
        //Sets the color as final argument
        setSubject({
            ...subject,
            color: selectedColorValue,
        });
    },[selectedColorValue]);

    // Execute Mutations
    const handleSubmitSubject = (e) =>{
        e.preventDefault();
        //Helper functions
        const create = async () =>{
            await createSubject({
                variables: {
                    name: subject.name,
                    color: subject.color,
                    daysOfWeek: subject.days,
                    startHour: subject.startHour,
                    endHour: subject.endHour,
                }
            });
        }
        const update = async () =>{
            await updateSubject({
                variables: {
                    subjectId: subject.id,
                    name: subject.name,
                    color: subject.color,
                    daysOfWeek: subject.days,
                    startHour: subject.startHour,
                    endHour: subject.endHour,
                }
            });
        }
        if(subject.id === ""){
            create();
        }
        else{
            update();
        }
        handleClose(!showForm);
    }
    const handleDeleteSubject = () =>{
        if(subject.id !== ""){
            const deleteSub = async () =>{
                await deleteSubject({
                    variables:{
                        id: subject.id,
                    }
                });
            }
            deleteSub();
            handleClose(!showForm);
        }
    }

    //Uses the data to avoid errors
    //TODO: Improve this code...
    useEffect(()=>{
        console.log(subjectDataCreated);
    },[subjectDataCreated]);

    useEffect(()=>{
        console.log(subjectDataDeleted);
    },[subjectDataDeleted]);

    useEffect(()=>{
        console.log(subjectDataUpdated);
    },[subjectDataUpdated]);

    return (
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
                <form 
                    onSubmit={e=>handleSubmitSubject(e)}
                    className={classes.rootContainer}
                >
                    <FormControl fullWidth className={classes.title}>
                        <Typography variant="h5">
                            REGISTRAR MATERIA
                        </Typography>
                    </FormControl >
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <TextField
                            variant="outlined" 
                            label="Nombre de la Materia"
                            id="subjectName"
                            name="name" 
                            value={subject.name}
                            onChange={handleChangeSubjectValue}
                        />
                    </FormControl> 
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <TextField
                            id="startHour"
                            variant="outlined"
                            label="Hora de Inicio"
                            name="startHour"
                            value={subject.startHour}
                            onChange={handleChangeSubjectValue}
                            type="time"
                            defaultValue="07:00"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                        />
                    </FormControl>    
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <TextField
                            id="endHour"
                            variant="outlined"
                            label="Hora de Fin"
                            name="endHour"
                            value={subject.endHour}
                            onChange={handleChangeSubjectValue}
                            type="time"
                            defaultValue="07:00"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                        />
                    </FormControl> 
                    <FormControl fullWidth className={classes.margin} variant="outlined" component="fieldset" justify="center">
                        <FormLabel component="legend" style={{textAlign:'center'}}>Días de Clases</FormLabel>
                        <FormGroup row justify="center">
                            {
                                daysOfWeek.map(day =>(
                                    <FormControlLabel
                                        key={day.dayOfWeek}
                                        label={day.day}
                                        name={day.dayOfWeek}
                                        checked={day.value}
                                        control={<Checkbox color="primary" />}
                                        labelPlacement="bottom"
                                        onChange={handleSelectDays}
                                    />
                                ))
                            }
                        </FormGroup>
                    </FormControl> 
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <FormLabel component="legend" style={{textAlign:'center'}}>Selecciona un color</FormLabel>
                        <ColorSelector
                            selectedColorValue={selectedColorValue}
                            setselectedColorValue={setselectedColorValue}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        className={classes.button}
                        
                    >
                        Guardar Información de la Materia
                    </Button>
                </form>
                <Button
                    type="submit"
                    disabled={subject.id===""}
                    color="secondary"
                    size="large"
                    fullWidth
                    className={classes.button}
                    onClick={handleDeleteSubject}
                >
                    Eliminar Materia
                </Button>
            </Paper>
        </Modal>
    );
}

const CREATE_SUBJECT = gql`
mutation(
  $name: String!,
  $color: String!,
  $daysOfWeek: [Int]!,
  $startHour: String!,
  $endHour: String!,
){
  createSubjectAndSchedule(
    name: $name,
    color: $color,
    daysOfWeek: $daysOfWeek,
    startHour: $startHour,
    endHour: $endHour,
  ){
    id,
  }
}
`;

const DELETE_SUBJECT = gql`
mutation($id: ID!){
  deleteSubject(id: $id){
    id,
  }
}
`;

const UPDATE_SUBJECT = gql`
mutation updateSubjectSchedule(
  $subjectId: ID!
  $name: String!,
  $color: String!,
  $daysOfWeek: [Int]!,
  $startHour: String!,
  $endHour: String!,
){
  updateSubjectAndSchedule(
    subjectId: $subjectId,
    name: $name,
    color: $color,
    daysOfWeek: $daysOfWeek,
    startHour: $startHour,
    endHour: $endHour,
  ){
    id,
  }
}
`;

export default SubjectForm;

SubjectForm.propTypes = {
    showForm: PropTypes.bool,
    handleClose: PropTypes.func,
    subject: PropTypes.object, 
    setSubject: PropTypes.func,
};