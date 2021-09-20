import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import { LibraryBooks, Delete } from '@material-ui/icons';
// Graphql
import { useQuery, useMutation, gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '10px',
        marginTop: '10px',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    noteContent: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      padding: '20px',
      margin: '0',
    }
}));

const NotesList = ({ subjectId, setRichTextNote, setPlainTextNote, setNoteId}) => {
  const classes = useStyles();

  const{data, loading, error, called} = useQuery(GET_NOTES, {
    variables: {
        subjectId: subjectId,
    },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), // "| GOOGLE_TOKEN"
      }
    },
    fetchPolicy: "cache-and-network",
  });

  const [deleteNote, {error: errorDelete}] = useMutation(DELETE_NOTE, {
    context: {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
        }
    },
    refetchQueries:[{
        query: GET_NOTES,
        variables: {
          subjectId: subjectId,
        },
        context:{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
            }
        }
    }],
    awaitRefetchQueries: true,
  });

  const handleClickOpenNote = (note) =>{
    console.log("Click", note.id)
    setRichTextNote(note.richTextNote);
    setPlainTextNote(note.plainTextNote);
    setNoteId(note.id);
  }

  const handleClickDeleteNote = async (id) =>{
    console.log(`You have deleted the note ${id}`);
    await deleteNote({variables:{
      id: id,
    }});
  }

  return ( 
    <Fragment>
    {
      errorDelete && errorDelete.message ? 
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        <strong>Ocurrio un error al eliminar la nota</strong> - {errorDelete.message}
      </Alert>
      : null
    }
    {
      loading ?
        <LinearProgress />
      : error && error.message ?
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>Ocurrio un error al obtener tus notas</strong> - {error.message}
        </Alert>
      : !loading && called && data.getNotes.length < 1 ?
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          No existen notas... ¡Crea tu primer nota!
        </Alert>
      : 
      <List className={classes.root} component="nav">
      { data && data.getNotes ? 
          <Fragment>
          {
            data.getNotes.map(note =>(
              <Fragment 
                  key={note.id}
              >
                <ListItem 
                    alignItems="flex-start"
                    button
                    onClick={() => handleClickOpenNote(note)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <LibraryBooks/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText className={classes.noteContent}
                    primary={note.plainTextNote}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {new Date(note.createdAt).toDateString()}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={()=>handleClickDeleteNote(note.id)}
                    >
                      <Delete/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="middle" component="li" />
              </Fragment>
            ))
          }
          </Fragment>
        : null
      }
    </List>
    }
    </Fragment>
  );
}

export const GET_NOTES = gql`
  query getNotes($subjectId: ID!){
    getNotes(subjectId: $subjectId){
      id,
      richTextNote,
      plainTextNote,
      createdAt
    }
  }
`;
 
const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!){
    deleteNote(id: $id){
      id,
      user{
        name
      }
    }
  }
`;

export default NotesList;