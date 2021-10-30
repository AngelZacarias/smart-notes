import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Grid,
  TextField,
  Paper,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Refresh } from '@material-ui/icons';
import { MovingLetters } from './../../../components/MovingLetters/MovingLetters';
import Spinner from './../../../components/Spinner/Spinner';
import RegularButton  from './../../../components/CustomButtons/Button';

import { SubjectContext } from './../../../hooks/SubjectContext';

// Dependencies for NPL IMPORTANT: KEEP tfjs
//eslint-disable-next-line
import * as tf from "@tensorflow/tfjs"
import * as qna from "@tensorflow-models/qna";

const useStyles = makeStyles((theme) => ({
  textbox: {
    paddingBottom: theme.spacing(1),
  },
}));

const QuestionAnswer = () => {
  // References
  const [notes, setNotes] = useState('');
  const [question, setQuestion] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [waiting, setWaiting] = useState(false);

  // Context
  const { subjectInformation, getColor } = useContext(SubjectContext);
  
  // Classes
  const classes = useStyles();
  
  // State
  const [listening, setListening] = useState(true);
  const [answer, setAnswer] = useState([]);
  const [model, setModel] = useState(null);

  // Query for notes
  const{data: dataNotes, loading: loadingNotes, error:errorNotes} = useQuery(GET_NOTES, {
    variables: {
        subjectId: subjectInformation.id,
    },
    context: {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"), 
      }
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(()=>{
    if( dataNotes && dataNotes.getNotes ){
      setNotes(dataNotes.getNotes.map(note => note.plainTextNote). join("\n"));
    }
    else{
      setNotes('');
    }
  },[dataNotes]);

  // Build our model
  const loadModel = async () =>{
    try{
      const loadedModel = await qna.load();
      setModel(loadedModel);
      console.log('Model Loaded');
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    loadModel();
  },[]);

  const handleFoundAnswer = async (event) =>{
    try{
      if(event.key === 'Enter' && model !== null){
        console.log('question submitted');
        const passage = notes;
        const newQuestion = question;
        setAskedQuestion(question);
        setQuestion('');
        setWaiting(true);
        const answers = await model.findAnswers(newQuestion, passage);
        setWaiting(false);
        setAnswer(answers)
        setListening(false);
      }
    }
    catch(err){
      console.log(err);
    }
  }

  const handleClickClear = () =>{
    setListening(true);
    setAskedQuestion('');
    setAnswer([])
  }

  return ( 
    
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      component={Paper}
      spacing={2}
    >
      {
        errorNotes ?
          <Grid item>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>Ocurrio un error al obtener tus notas</strong> - {errorNotes.message}
            </Alert>
          </Grid>
        :
          <Fragment>
            <Grid item>
              {
                  loadingNotes?
                  <MovingLetters
                    text="Estamos cargando tus notas, espera un momento..."
                  />
                  : waiting ? 
                  <MovingLetters
                    text="Estamos buscanto tu respuesta..."
                  />
                  : listening && model !== null ? 
                  <MovingLetters
                    text="Listo, ¿Tienes alguna duda?" 
                  />
                  : model === null ?
                  <MovingLetters
                    text="Estamos analizando tus notas, espera un momento..."
                  />
                  :
                  <Typography
                      variant='h2'
                      align='center'
                      color='secondary'
                    >
                    {askedQuestion}
                  </Typography>
                }
            </Grid>
            <Grid item>
            {
              listening ? 
                <Spinner
                  color={getColor()}
                />
              : answer && answer.length > 0 ?
                <Fragment>
                  <Grid item>
                    <Typography
                      variant='subtitle1'
                      paragraph
                      display='block'
                      align='center'
                      color='secondary'
                    >
                      {answer[0].text}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RegularButton
                        variant="contained"
                        color={subjectInformation.color}
                        startIcon={<Refresh/>}
                        fullWidth
                        onClick={()=>handleClickClear()}
                    >
                        Limpiar Respuesta
                    </RegularButton>
                  </Grid>
                </Fragment>
              : answer.length === 0 ?
                <Fragment>
                  <Grid item>
                    <Typography
                      variant='subtitle1'
                      paragraph
                      display='block'
                      align='center'
                      color='secondary'
                    >
                      No pudimos encontrar una respuesta...
                    </Typography>
                  </Grid>
                  <Grid item>
                    <RegularButton
                        variant="contained"
                        color={subjectInformation.color}
                        startIcon={<Refresh/>}
                        fullWidth
                        onClick={()=>handleClickClear()}
                    >
                        Hacer otra pregunta
                    </RegularButton>
                  </Grid>
                </Fragment>
              :
                null 
            }
            </Grid>
            <Grid item>
              <TextField 
                color="secondary"
                fullWidth
                id="question" 
                className={classes.textbox}
                placeholder="Escribe tu pregunta" 
                variant="outlined" 
                name="question"
                value={question}
                disabled={waiting}
                onChange={(e)=>setQuestion(e.target.value)}
                onKeyPress={(e)=> handleFoundAnswer(e)}
              />
            </Grid>
          </Fragment>
      }
    </Grid>
  );
}

const GET_NOTES = gql`
  query getNotes($subjectId: ID!){
    getNotes(subjectId: $subjectId){
      plainTextNote,
    }
  }
`;

export default QuestionAnswer;