import React, { useEffect, useState, useContext } from "react";
import useSound from 'use-sound';
import { ButtonGroup, Typography, IconButton } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';
import RegularButton  from './../../../components/CustomButtons/Button';
import alarmSfx from 'assets/sound/notification_tone.mp3';
import './pomodoro.css'

import { SubjectContext } from './../../../hooks/SubjectContext';

const Pomodoro = () => {
  const { subjectInformation } = useContext(SubjectContext);
  const [clock, setClock] = useState({
    minutes: "25",
    seconds: "00",
  });
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timer, setTimer] = useState();
  const [selectedMode, setSelectedMode] = useState('Work Time');

  const [play] = useSound(alarmSfx);

  const handleStop = () =>{
    if(selectedMode === 'Work Time'){
      setSecondsLeft(25 * 60);
    }
    else if(selectedMode === 'Short Break Time'){
      setSecondsLeft(5 * 60);
    }
    else if(selectedMode === 'Long Break Time'){
      setSecondsLeft(15 * 60);
    }
    else{
      setSecondsLeft(25 * 60);
    }
    setTimer(null);
  }

  const handleSetWorkTime = () =>{
    setSelectedMode('Work Time');
    setSecondsLeft(25 * 60);
  }

  const handleSetShortBreakTime = () =>{
    setSelectedMode('Short Break Time');
    setSecondsLeft(5 * 60);
  }

  const handleSetLongBreakTime = () =>{
    setSelectedMode('Long Break Time');
    setSecondsLeft(15 * 60);
  }

  const toDoubleDigit = (num) => {
    if(num < 10) {
      return "0" + parseInt(num, 10);
    }
    return num;
  }

  const start = () => {
    const timer = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
      if (secondsLeft === 0) {
        clearInterval(timer);
      }
    }, 1000);
    setTimer(timer);
  };
  
  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(timer);
    }
  }, [secondsLeft, timer]);

  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  useEffect(()=>{
    try{
      if(secondsLeft > 0){
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft - minutes * 60;
        setClock({
          minutes: toDoubleDigit(minutes),
          seconds: toDoubleDigit(seconds),
        });
      }
      else if(secondsLeft === 0){
        setClock({
          minutes: "00",
          seconds: "00",
        });
        play();
      }
    }
    catch(err){
      console.log("Error getting the time",err)
    }

  },[secondsLeft]);
  
  return (
    <div className="App">
        <div id="container">
          <div id="timer" className={`bColor-${subjectInformation.color}`}>
            <div className="time">
              <Typography
                variant='title1'
              >
                {clock.minutes}:{clock.seconds}
              </Typography>
              <div className="button-actions">
                <IconButton 
                  color="inherit"
                  onClick={start}
                >
                  <PlayArrow fontSize="large"/>
                </IconButton>
                <IconButton 
                  color="inherit"
                  onClick={handleStop}
                >
                  <Stop fontSize="large"/>
                </IconButton>
              </div>
            </div>
          </div>
          <ButtonGroup size="small">
              <RegularButton
                size="sm"
                color={(selectedMode === 'Short Break Time')? subjectInformation.color :"white"}
                onClick={handleSetShortBreakTime}
              >
                Descanso Corto
              </RegularButton>
              <RegularButton
                size="sm"
                color={(selectedMode === 'Work Time')? subjectInformation.color :"white"}
                onClick={handleSetWorkTime}
              >
                Tiempo de Enfoque
              </RegularButton>
              <RegularButton
                size="sm"
                color={(selectedMode === 'Long Break Time')? subjectInformation.color :"white"}
                onClick={handleSetLongBreakTime}
              >
                Descanso Largo
              </RegularButton>
            </ButtonGroup>
        </div>
    </div>
  );
}
 
export default Pomodoro;