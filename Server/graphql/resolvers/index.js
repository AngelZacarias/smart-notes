import subjectsResolvers from './subjects';
import userResolvers from './users';
import scheduleResolvers from './schedule';
import tasksResolvers from './tasks';
import noteResolvers from './notes';

module.exports = {
    //Nested Queries
    Task: {
        //The subject owner for this task
        subject: subjectsResolvers.Task.subject,
        //The user owner for this task
        user: userResolvers.NestedUserReference.user,
    },
    //Nested Queries: 
    Subject: {
        //the user owner of this subject
        user: userResolvers.NestedUserReference.user,
        schedule: scheduleResolvers.Subject.schedule,
    },
    Schedule: {
        subject: subjectsResolvers.Task.subject,
    },
    Profile: {
        user: userResolvers.NestedUserReference.user,
    },
    Note: {
        subject: subjectsResolvers.NestedSubjectReference.subject,
        user: userResolvers.NestedUserReference.user,
    },
    // Default Queries
    Query:{
        ...subjectsResolvers.Query,
        ...scheduleResolvers.Query,
        ...tasksResolvers.Query,
        ...userResolvers.Query,
        ...noteResolvers.Query
    },
    Mutation:{
        ...subjectsResolvers.Mutation,
        ...tasksResolvers.Mutation,
        ...userResolvers.Mutation,
        ...noteResolvers.Mutation
    }
}