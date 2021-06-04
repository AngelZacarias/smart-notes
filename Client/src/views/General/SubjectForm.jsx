import React, { useState } from 'react'
import { 
    makeStyles, 
    Modal, 
    Paper, 
    Typography,
    TextField,
    FormControl ,
} from "@material-ui/core";
import PropTypes from "prop-types";


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

const SubjectForm = ({showForm, handleClose}) => {
    const classes = useStyles();
    //State for inputs values
    const[subject, setSubject] = useState({
        id: "",
        name: "",
        days: [],
        startHour: "",
        endHour: "",
        color: "",
    })

    const handleChangeSubjectValue = (e) =>{
        setSubject({
            ...subject,
            [e.target.name]: e.target.value,
        })
    }

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
                <form className={classes.rootContainer}>
                        <FormControl fullWidth className={classes.title}>
                            <Typography variant="h5">
                                REGISTRAR MATERIA
                            </Typography>
                        </FormControl >
                        <FormControl fullWidth className={classes.margin}>
                            <TextField 
                                variant="outlined" 
                                label="Nombre de la Materia"
                                name="name" 
                                value={subject.name}
                                onChange={handleChangeSubjectValue}
                            />
                        </FormControl>  
                </form>
            </Paper>
        </Modal>
    );
}

export default SubjectForm;

SubjectForm.propTypes = {
    showForm: PropTypes.bool,
    handleClose: PropTypes.func,
};