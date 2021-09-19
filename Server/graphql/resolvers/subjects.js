const { Query } = require('mongoose');
const Subject = require('../../models/Subject');
const checkAuth = require("../../utils/check-auth");

import Schedule from '../../models/Schedule';
// Usefull for query to relationship
import scheduleResolver from './schedule';

module.exports = {
    Query: {
        async getSubjects(_, args, context){
            const user = checkAuth(context);
            try {
                const subjects = await Subject.find();
                return subjects;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getMyCurrentSubjects(_, args, context){
            const user = checkAuth(context);
            try {
                const subjects = await Subject.find({ user: user.id, active: true});
                return subjects;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getSubject(parent, {subjectId}, context, info){
            const user = checkAuth(context);
            try{
                const subject = await Subject.findById(subjectId);
                if(subject){
                    return subject;
                }
                else{
                    throw new Error("Subject not found");
                }
            } catch (err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createSubject(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Save
            try{
                const newSubject = new Subject({
                    name: args.name,
                    color: args.color,
                    active: true,
                    createdAt: new Date().toISOString(),
                    user: user.id,
                });
                const response = await newSubject.save();
                return{
                    ...response._doc,
                    id: response._id
                }
            } catch (err){
                console.log("Error")
                throw new Error(err);
            }
        },
        async createSubjectAndSchedule(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Save Process
            try{
                //Creates the subject object with the minumin required values
                const newSubject = new Subject({
                    name: args.name,
                    color: args.color,
                    active: true,
                    createdAt: new Date().toISOString(),
                    user: user.id,
                    schedules: [],
                });
                //Saves the subject
                const response = await newSubject.save();
                //Is also the schedule sended in args?
                if("daysOfWeek" in args && "startHour" in args && "endHour" in args){
                    //Create the schedule for this subject. Iterate over all the days
                    await Promise.all(args.daysOfWeek.map(async (dayOfWeek)=>{
                        //Create the subject entry
                        console.log("Creating for day:", dayOfWeek);
                        const schedule = await scheduleResolver.Mutation.createSchedule(this,{
                            dayOfWeek: dayOfWeek, 
                            startHour: args.startHour, 
                            endHour: args.endHour, 
                            subjectId: response._id,
                        }, context, info);
                        //Push the schedule reference into our subject
                        Subject.findById(response._id, (err, subject) => {
                            if(err) console.log(err);
                            subject.schedules.push(schedule.id);
                            subject.save();
                        });
                    }));
                }
                //Returns our subject
                return{
                    ...response._doc,
                    id: response._id
                }
            } catch (err){
                console.log("Error creating the subject with schedule");
                throw new Error(err);
            }
        },
        async updateSubject(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Update Data
            const response = await Subject.findByIdAndUpdate(
                args.id,
                {
                    name: args.name,
                    color: args.color,
                    createdAt: new Date(),
                    user: user.id,
                },
                {new: true},
            );
            return{
                ...response._doc,
                id: response._id
            }
        },
        async updateSubjectAndSchedule(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Update process
            try{
                //Update Subject Data
                const response = await Subject.findByIdAndUpdate(
                    args.subjectId,
                    {
                        name: args.name,
                        color: args.color,
                        createdAt: new Date(),
                        user: user.id,
                    },
                    {new: true},
                );
                //Check if there are shedule arguments
                if("daysOfWeek" in args && "startHour" in args && "endHour" in args){
                    //Deletes the schedule for this subject. Iterate over all the schedulesId
                    await Promise.all(response.schedules.map(async (scheduleId)=>{
                        //Deletes the schedule entry
                        console.log("Updating for schedule:", scheduleId);
                        await scheduleResolver.Mutation.deleteSchedule(this,{
                            id: scheduleId,
                        }, context, info);
                        //Removes the schedules for our subject
                        await Subject.findByIdAndUpdate(response._id, {schedules: []});
                    }));

                    //Creates the new schedule for this subject
                    await Promise.all(args.daysOfWeek.map(async (dayOfWeek)=>{
                        //Create a new schedule
                        const schedule = await scheduleResolver.Mutation.createSchedule(this,{
                            dayOfWeek: dayOfWeek, 
                            startHour: args.startHour, 
                            endHour: args.endHour, 
                            subjectId: response._id,
                        }, context, info);
                        //Push the schedule reference into our subject
                        Subject.findById(response._id, (err, subject) => {
                            if(err) console.log(err);
                            subject.schedules.push(schedule.id);
                            subject.save();
                        })
                    }));
                }
                return{
                    ...response._doc,
                    id: response._id
                }

            } catch (err){
                console.log("Error creating the subject with schedule");
                throw new Error(err);
            }
        },
        async deleteSubject(parent, args, context, info){
            //Validate User
            const user = checkAuth(context);
            if(args.id === ""){
                throw new Error("Subject ID is required");
            }
            try{
                //Delete the subject and gets the subject deleted
                const response = await Subject.findOneAndDelete({_id: args.id});

                //Deletes the schedule for this subject. Iterate over all the schedulesId
                await Promise.all(response.schedules.map(async (scheduleId)=>{
                    //Deletes the schedule entry
                    console.log("Deleting schedule:", scheduleId);
                    await scheduleResolver.Mutation.deleteSchedule(this,{
                        id: scheduleId,
                    }, context, info);
                }));

                return{
                    ...response._doc,
                    id: response._id,
                };

            } catch (err){
                throw new Error(err);
            }
        }
    },
    //Resolvers for nested queries
    Task: {
        async subject(parent, args, context, info){
            return await Subject.findById(parent.subject);
        }
    },
    NestedSubjectReference: {
        async subject(parent, args, context, info){
            return await Subject.findById(parent.subject);
        }
    }
}
