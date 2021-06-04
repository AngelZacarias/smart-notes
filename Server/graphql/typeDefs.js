const { gql } = require('apollo-server');

module.exports = gql`
    type User{
        id: ID!
        email: String
        password: String
        active: Boolean
        name: String
        lastName: String
        createdAt: String
        updatedAt: String
        subjects: [Subject]
        profile: Profile
    }
    type Subject{
        id: ID!
        name : String
        color: String
        active: Boolean
        createdAt: String
        tasks: [Task]
        numberOfPendingTasks: Int
        notes: [Note]
    }
    type Task{
        id: ID!
        assignment: String!
        description: String
        deadline: String
        active: Boolean
        user: User
        subject: Subject
    }
    type Note{
        id: ID!
        title: String
        description: String
        user: User
        subject: Subject
        tags: [String]
        createdAt: String
    }
    type Profile{
        id: ID!
        bio: String
        carrer: String
        facebookURL: String
        linkedinURL: String
        twitterURL: String
        createdAt: String
        user: User
    }
    type Schedule{
        id: ID!
        dayOfWeek: Int 
        startHour: String
        endHour: String
        createdAt: String
        subject: Subject
        user: User
    }
    type Query{
        getSubjects: [Subject]
        getSubject(subjectId: ID!): Subject
        getTasks: [Task]
        getTask(id: ID!): Task
    },
    type Mutation{
        createSubject(name: String!, color: String!) : Subject!
        updateSubject(id: ID!, name: String!, color: String!) : Subject!
        createTask(subjectId: ID!, assignment: String!, description: String!, deadline: String!) : Task!
    },
`;