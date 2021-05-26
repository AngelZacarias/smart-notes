const subjectsResolvers = require('./subjects');
const userResolvers = require('./users');

module.exports = {
    Query:{
        ...subjectsResolvers.Query,
    },
    Mutation:{
        ...subjectsResolvers.Mutation,
    }
}