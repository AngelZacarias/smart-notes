const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');

const typeDefs = gql`
    type Query{
        sayHi: String!
    },
`;

const resolvers = {
    Query: {
        sayHi(){
            return "Hello Smart Notes";
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Database Connected')
        return server.listen({ port: 5000 })
    })
    .then(res =>{
        console.log(`Server running at ${res.url}`)
    })
    .catch((e) => {
        console.error('Connection error', e.message);
    })