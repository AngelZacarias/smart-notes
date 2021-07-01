const { Query } = require('mongoose');
const Schedule = require('../../models/Schedule');
const checkAuth = require("../../utils/check-auth");

module.exports = {
    Query: {
        async getCompleteScheduleForSubject(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            try {
                if(!(args.subjectId === "")){
                    throw new Error("The subjectId must be provided");
                }
                const subjectSchedule = await Schedule.find({subject: args.subjectId});
                return subjectSchedule;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getMySchedule(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            try {
                const mySchedule = await Schedule.find({user: user.id});
                return mySchedule;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation:{
        async  createSchedule(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);

            //Validate data
            if(!(args.dayOfWeek>-1 && args.dayOfWeek <7)){
                throw new Error("The day of week must be a number between 1 and 7");
            }
            let startHr = args.startHour.split(":");
            if(!(parseInt(startHr[0],10)>-1 && parseInt(startHr[0],10)<24)){
                throw new Error("The Start Hour must be a value between 00:00 and 23:59");
            }
            if(!(parseInt(startHr[1],10)>-1 && parseInt(startHr[1],10)<60)){
                throw new Error("The Start Hour must be a value between 00:00 and 23:59");
            }
            let endHr = args.endHour.split(":");
            if(!(parseInt(endHr[0],10)>-1 && parseInt(endHr[0],10)<24)){
                throw new Error("The End Hour must be a value between 00:00 and 23:59");
            }
            if(!(parseInt(endHr[1],10)>-1 && parseInt(endHr[1],10)<60)){
                throw new Error("The End Hour must be a value between 00:00 and 23:59");
            }
            if(args.subjectId === ""){
                throw new Error("The Subject ID reference must be included");
            }
            //Save Process
            try{
                //Creates the schedule object
                const newSchedule = new Schedule({
                    dayOfWeek: args.dayOfWeek,
                    startHour: args.startHour,
                    endHour: args.endHour,
                    subject: args.subjectId,
                    createdAt: new Date().toISOString(),
                    user: user.id,
                });
                //Saves the schedule
                const response = await newSchedule.save();
                //Returns our schedule
                return{
                    ...response._doc,
                    id: response._id
                }
            } catch (err){
                console.log("Error creating the schedule")
                throw new Error(err);
            }
        },
        async  deleteSchedule(parent, args, context, info){
            //Validate User
            checkAuth(context);

            //Validate data
            if(args.id === ""){
                throw new Error("The Schedule ID reference must be included");
            }
            //Update Process
            try{
                //Update the schedule object where subjectId
                const response = await Schedule.findByIdAndDelete(args.id);
                //Returns our deleted schedule
                return{
                    ...response._doc,
                    id: response._id
                }
            } catch (err){
                console.log("Error deleting the schedule")
                throw new Error(err);
            }
        },
    },
    Subject:{
        async schedule(parent, args, context, info){
            try {
                if(parent.id === ""){
                    throw new Error("The subjectId must be provided");
                }
                const subjectSchedule = await Schedule.find({subject: parent.id});
                return subjectSchedule;
            } catch (err) {
                throw new Error(err);
            }
        },
    }
}