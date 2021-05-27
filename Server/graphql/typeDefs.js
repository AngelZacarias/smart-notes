const { gql } = require('apollo-server');

module.exports = gql`
    type Subject{
        id: ID!
        name : String!
        color: String!
        active: Boolean!
        createdAt: String!
    }
    type Query{
        getSubjects: [Subject]
        getSubject(subjectId: ID!): Subject
    },
    type Mutation{
        createSubject(name: String!, color: String!) : Subject!
    },
`;