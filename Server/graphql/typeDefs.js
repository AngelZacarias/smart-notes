const { gql } = require("apollo-server");

module.exports = gql`
    type Subject{
        id: ID!
        name : String!
        color: String!
        active: Boolean!
        createdAt: String!
    }
    type User{
      id: ID!
      name: String!
      lastName: String!
      email: String!
      active: Boolean!
      createdAt: String!
      updatedAt: String!
    }
    type Query{
        getSubjects: [Subject]
        getSubject(subjectId: ID!): Subject
    },
    type Mutation{
        createSubject(name: String!, color: String!) : Subject!
        createUserFromGoogleAuth(name: String!, lastName: String!, email: String!, token: String!) : User!
    },
`;
