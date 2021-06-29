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

const SubjectForm = ({showForm, handleClose}) => {
    const classes = useStyles();
    //State for mutations
    const [createSubject, { data: subjectDataCreated }] = useMutation(CREATE_SUBJECT, {
        context: {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), // "| GOOGLE_TOKEN"
            }
        },
        refetchQueries: [{
            query: GET_SUBJECTS,
            context: {
                headers: {
                  "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), // "| GOOGLE_TOKEN"
                }
            }
        }],
        awaitRefetchQueries: true,
    });

    //State for inputs values
    const[subject, setSubject] = useState({
        id: "",
        name: "",
        days: [],
        startHour: "",
        endHour: "",
        color: "",
    });
    const[daysOfWeek, setDaysOfWeek] = useState([
        { day: "Lu", value: false, dayOfWeek: 1 },
        { day: "Ma", value: false, dayOfWeek: 2 },
        { day: "Mi", value: false, dayOfWeek: 3 },
        { day: "Ju", value: false, dayOfWeek: 4 },
        { day: "Vi", value: false, dayOfWeek: 5 },
        { day: "Sa", value: false, dayOfWeek: 6 },
        { day: "Do", value: false, dayOfWeek: 7 },
    ]);
    const [selectedColorValue, setselectedColorValue] = useState('rose');
    
    // Change the state
    const handleChangeSubjectValue = (e) =>{
        setSubject({
            ...subject,
            [e.target.name]: e.target.value,
        });
    }
    const handleSelectDays = (e) =>{
        const numberOfDay = parseInt(e.target.name, 10);
        setDaysOfWeek([...daysOfWeek])

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
        console.log(newSelectedDays);
        
        setSubject({
            ...subject,
            days: newSelectedDays,
        });
        
    }

    // Execute Mutations
    const handleSubmitSubject = (e) =>{
        e.preventDefault();
        //Sets the color as final argument
        setSubject({
            ...subject,
            color: selectedColorValue,
        });
        console.log("1");

        //Helper functions
        const create = async () =>{
            await createSubject({
                variables:{
                    name: subject.name,
                    color: subject.color,
                    daysOfWeek: subject.daysOfWeek,
                    startHour: subject.startHour,
                    endHour: subject.endHour,
                }
            });
        }
        // Create the Subject
        create();
        console.log("ok");
        
    }
    const handleDeleteSubject = (e) =>{
        e.preventDefault();
        if(subject.id !== ""){
            console.log("Delete")
        }
    }

    //TODO: DELETE the following useEffect
    useEffect(()=>{
        console.log(subjectDataCreated);
    },[subjectDataCreated]);

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
                    className={classes.rootContainer}
                    onSubmit={handleSubmitSubject}
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


export default SubjectForm;

SubjectForm.propTypes = {
    showForm: PropTypes.bool,
    handleClose: PropTypes.func,
};