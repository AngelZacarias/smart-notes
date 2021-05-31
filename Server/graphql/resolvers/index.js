const subjectsResolvers = require('./subjects');
const userResolvers = require('./users');

module.exports = {
    Query:{
        ...subjectsResolvers.Query,
        // ...userResolvers.Mutation
    },
    Mutation:{
        ...subjectsResolvers.Mutation,
        ...userResolvers.Mutation
    }
}