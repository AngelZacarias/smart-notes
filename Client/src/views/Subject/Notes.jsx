import React, { useState, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline, Save } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import RegularButton  from './../../components/CustomButtons/Button';
import {useMutation, gql } from '@apollo/client';

import NoteEditor from './Notes/NoteEditor';
import NotesList, { GET_NOTES } from './Notes/NotesList';

//Context for this subject
import { SubjectContext } from './../../hooks/SubjectContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2)
    },
    button: {
        width: '100%',
    },
    leftList: {
        height: '450px',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
}));

const Notes = () => {
    const classes = useStyles();
    const { subjectInformation } = useContext(SubjectContext);

    const [noteId, setNoteId] = useState('');
    const [richTextNote, setRichTextNote] = useState('');
    const [plainTextNote, setPlainTextNote] = useState('');

    const handleClickNewNote = () =>{
        setRichTextNote('');
        setPlainTextNote('');
        setNoteId('');
    }

    const [saveNote, {data: savedNote, error: errorSave}] = useMutation(SAVE_NOTE, {
        context: {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
            }
        },
        refetchQueries:[{
            query: GET_NOTES,
            variables: {
                subjectId: subjectInformation.id,
            },
            context:{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
                }
            }
        }],
        awaitRefetchQueries: true,
    });

    const save = async () =>{
        try{
            await saveNote({
                variables:{
                    id: noteId,
                    subjectId: subjectInformation.id,
                    plainTextNote: plainTextNote,
                    richTextNote: richTextNote,
                }
            });
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        if(savedNote && savedNote.createOrUpdateNote){
            setNoteId(savedNote.createOrUpdateNote.id);
        }
    }, [savedNote])

    const handleSaveNote = () =>{
        save();
    }

    return (
        <Paper className={classes.paper}>
            {
                errorSave && errorSave.message ? 
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <strong>Ocurrio un error al autoguardar tu nota</strong> - {errorSave.message}
                </Alert>
                : null
            }
            <Grid 
                container 
                component="main" 
                direction="row"
                justify="space-around"
                alignItems="stretch"
                spacing={1}
            >
                <CssBaseline />
                <Grid item xs={6} sm={3}>
                    <RegularButton
                        variant="contained"
                        color={subjectInformation.color}
                        size="large"
                        className={classes.button}
                        startIcon={<AddCircleOutline/>}
                        onClick={()=>handleClickNewNote()}
                    >
                        Nueva Nota
                    </RegularButton>
                    <div className={classes.leftList}>
                        <NotesList
                            subjectId={subjectInformation.id}
                            setRichTextNote={setRichTextNote}
                            setPlainTextNote={setPlainTextNote}
                            setNoteId={setNoteId}
                        />
                    </div>
                </Grid>
                <Grid item xs={18} sm={9}>
                    <Grid item>
                        <NoteEditor
                            className={classes.paper}
                            richTextNote={richTextNote}
                            setRichTextNote={setRichTextNote}
                            setPlainTextNote={setPlainTextNote}
                            plainTextNote={plainTextNote}
                            color={subjectInformation.color}
                            noteId={noteId}
                        />  
                    </Grid>
                    <Grid item>
                        <RegularButton
                            color={subjectInformation.color}
                            className={classes.button}
                            startIcon={<Save/>}
                            onClick={()=>handleSaveNote()}
                        >
                            Guardar Nota
                        </RegularButton>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
 
const SAVE_NOTE = gql`
mutation createOrUpdateNote($id: ID, $subjectId: ID!, $plainTextNote: String!, $richTextNote: String!){
  createOrUpdateNote(id: $id, subjectId: $subjectId, plainTextNote: $plainTextNote, richTextNote: $richTextNote){
    id,
    plainTextNote
  }
}
`;

export default Notes;