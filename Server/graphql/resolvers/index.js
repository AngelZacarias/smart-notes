const subjectsResolvers = require('./subjects');
const userResolvers = require('./users');
import tasksResolvers from './tasks';

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
    },
    // Default Queries
    Query:{
        ...subjectsResolvers.Query,
        ...tasksResolvers.Query,
        ...userResolvers.Query
    },
    Mutation:{
        ...subjectsResolvers.Mutation,
        ...tasksResolvers.Mutation,
        ...userResolvers.Mutation
    }
}