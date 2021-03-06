const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require("dotenv").config();
const { taskReminder } = require("./utils/jobs/scheduler");

const server = new ApolloServer({
    subscriptions: {
        path: '/subscriptions'
    },
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect( process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Database Connected')
        return server.listen({ port: process.env.PORT || 5000 })
    })
    .then(res =>{
        console.log(`Server running at ${res.url}`)
        console.log(`Subscriptions running at ${res.subscriptionsUrl}`)
    })
    .catch((e) => {
        console.error('Connection error', e.message);
    })

taskReminder();
  