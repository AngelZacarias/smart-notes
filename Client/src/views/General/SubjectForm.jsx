import React, { useState, useEffect } from 'react'
import { 
    makeStyles, 
    TextField,
    FormControl,
    FormLabel,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Button,
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { gql, useMutation } from '@apollo/client';
import ColorSelector from '../../components/Colors/ColorSelector';
import PropTypes from "prop-types";
import { GET_SUBJECTS } from './Subjects';

const useStyles = makeStyles((theme) => ({
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    actions: {
        spacing: theme.spacing(3),
    }
}));

const SubjectForm = ({ showForm, handleClose, subject, setSubject }) => {
    const classes = useStyles();

    //:::::::::: MUTATIONS ::::::::::::
    //CREATE SUBJECT
    const [createSubject] = useMutation(CREATE_SUBJECT, {
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
    const [updateSubject] = useMutation(UPDATE_SUBJECT, {
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
    const [deleteSubject] = useMutation(DELETE_SUBJECT, {
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
    /*
    useEffect(()=>{
        console.log(subjectDataCreated);
    },[subjectDataCreated]);

    useEffect(()=>{
        console.log(subjectDataDeleted);
    },[subjectDataDeleted]);

    useEffect(()=>{
        console.log(subjectDataUpdated);
    },[subjectDataUpdated]);
*/
    return (
        <Dialog
            open={showForm}
            onClose={()=>handleClose(!showForm)}
            scroll="body"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle>
                REGISTRAR MATERIA
            </DialogTitle>
            <DialogContent
            >
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
            </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={e=>handleSubmitSubject(e)}
                    >
                        Guardar Materia
                    </Button>
                    <Button
                        disabled={subject.id===""}
                        color="secondary"
                        onClick={handleDeleteSubject}
                    >
                        Eliminar Materia
                    </Button>
                </DialogActions>
        </Dialog>
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