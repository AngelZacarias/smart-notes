import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Scheduler,
  WeekView,
  Appointments,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import { getColorHexValue } from '../../ThemeConfig';

const Calendar = ({ appointments }) => {
    const appointmentResources =  appointments.map(sch => (
        {
          fieldName: 'location',
          title: 'Location',
          instances: [ {id: sch.location, text: sch.location, color: getColorHexValue(sch.color), }],
          id: sch.id,
        }
    ));
    
    const startHour = (Math.min.apply(null, appointments.map(sch=> sch.startDate.getHours()))) - 1;
    const endHour = (Math.max.apply(null, appointments.map(sch=> sch.endDate.getHours()))) + 1;
    

    return ( 
        <Fragment>
            <Paper>
                <Scheduler data={appointments}>
                <WeekView startDayHour={startHour} endDayHour={endHour} />
                <Appointments />
                <Resources
                    data={appointmentResources}
                    mainResourceName="location"
                />
                </Scheduler>
            </Paper>
        </Fragment>
        
    );
}
 
export default Calendar;