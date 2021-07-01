import React from 'react';
import { Typography, Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container:{
        backgroundColor: theme.palette.background.paper,
        alignItems: 'center',
        padding: theme.spacing(3),
    },
}));

const About = () => {
    const classes = useStyles();
    return ( 
        <Paper variant="outlined" className={classes.container} elevation={2}>
            <Typography variant="h4" component="h2" gutterBottom>
                SmartNotes
            </Typography>
            <Typography variant="body" gutterBottom>
                <p>
                    Es una aplicación pensada para ayudarte con la administración de tus materias y notas y tareas por hacer de manera centralizada.
                </p>
                <p>
                    Crea tus materias de tu ciclo escolar, identificalas con un color y selecciona los dias y horas en los que estas tomandolas 
                    (actualmente no tenemos una opción para seleccionar diferentes horarios en diferentes días a la semana).
                </p>
                <p>
                    Crea tus mejores apuntes para tus materias, con ellos podremos ayudarte a generar un set rapido de <strong>las notas mas importantes</strong> de forma <strong>inteligente</strong>.
                </p>
                <p>
                    También podrás mandarle mensajes a tus amigos, buscar a tus compañeros y comenzar a hacer networking para cualquier tipo de proyectos que tengas.
                </p>
                <p>
                    Este proyecto se encuentra en progreso e irá mejorando en los siguientes meses.
                </p>
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                <p>__________________________________</p>
                <p>El equipo de SmartNotes</p>
            </Typography>
        </Paper>
    );
}
 
export default About;