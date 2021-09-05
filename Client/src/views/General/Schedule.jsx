import React, { useState, useEffect } from 'react';
import { LinearProgress  } from '@material-ui/core';
import Calendar from '../../components/Calendar/Calendar';
import { useQuery, gql } from '@apollo/client';
import { Alert, AlertTitle } from '@material-ui/lab';

const Schedule = () => {
    const DayOfWeekToDate = (dayOfWeek, hours) => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + dayOfWeek;
        d.setDate(diff);
        const hour = hours.split(":")[0];
        const minutes = hours.split(":")[1];
        d.setHours(hour, minutes, 0);
        return new Date(d);
    }
    //Array of appointments sended to our calendar component
    const[appointments, setAppointments] = useState([]);
    

    //QUERIES
    const{data:mySchedule, loading, error} = useQuery(GET_MY_SCHEDULE, {
        context: {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("JWT_TOKEN"),
          }
        }
      });

    //Execute and transform the schedule into something readeable for our component
    useEffect(()=>{
        if(mySchedule && !loading && mySchedule.getMySchedule){
          const subjectsSchedule = mySchedule.getMySchedule.map(sch => (
            {
              title: sch.subject.name,
              location: sch.subject.name,
              startDate: DayOfWeekToDate(sch.dayOfWeek, sch.startHour),
              endDate: DayOfWeekToDate(sch.dayOfWeek, sch.endHour),
              id: sch.id,
              color: sch.subject.color,
            }
          ));
          setAppointments(subjectsSchedule);
        }
    },[mySchedule]);

    return ( 
      loading ?
        <LinearProgress/>
      : mySchedule && mySchedule.getMySchedule && appointments.length > 0 ? 
        <Calendar
          appointments={appointments}
        />    
      : error && error.message ?
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>Ocurrio un error al obtener el horario</strong> - {error.message}
        </Alert>
      :
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        <strong>No existe un horario</strong> - crea materias para generar un horario.
      </Alert>
    );
}
 
const GET_MY_SCHEDULE = gql`
query getMySchedule{
  getMySchedule{
    id,
    dayOfWeek,
    startHour,
    endHour,
    subject{
      name
      color
    }
  }
}
`;

export default Schedule;