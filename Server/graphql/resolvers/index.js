const subjectsResolvers = require('./subjects');
const userResolvers = require('./users');
import tasksResolvers from './tasks';

module.exports = {
    //Nested Queries
    Task: {
        subject: subjectsResolvers.Task.subject,
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