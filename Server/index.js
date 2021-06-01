const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

<<<<<<< HEAD
const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
=======
const { MONGODB } = require('./config.js');

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
>>>>>>> master

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) =>({ req }),
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