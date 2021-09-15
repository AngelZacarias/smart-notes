const { gql } = require("apollo-server");

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
        token: String
    }
    type Subject{
        id: ID!
        name : String
        color: String
        active: Boolean
        createdAt: String
        tasks: [Task]
        user: User
        numberOfPendingTasks: Int
        notes: [Note]
        schedule: [Schedule]
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
    type Token {
      token: String!
    }
    type Follow {
      follower: User
      followed: User
      followerAble: Boolean
      followedAble: Boolean
    }
    type Query{
        getSubjects: [Subject]
        getMyCurrentSubjects: [Subject]
        getSubject(subjectId: ID!): Subject

        getCompleteScheduleForSubject(subjectId: ID!): [Schedule]
        getMySchedule: [Schedule]

        getTasks: [Task]
        getTask(id: ID!): Task

        normalLogin(email: String!, password: String!): Token
        getUser(email: String!): User
        getProfiles(keyword: String!): [User]
        getProfileById(userId: ID!): Profile
    },
    type Mutation{
        createSubject(name: String!, color: String!) : Subject!
        updateSubject(id: ID!, name: String!, color: String!) : Subject!
        deleteSubject(id: ID!) : Subject!

        createSubjectAndSchedule(name: String!, color: String!, daysOfWeek: [Int]!, startHour: String!, endHour: String!) : Subject!
        updateSubjectAndSchedule(subjectId: ID!, name: String!, color: String!, daysOfWeek: [Int]!, startHour: String!, endHour: String!) : Subject!

        createSchedule(dayOfWeek: Int!, startHour: String!, endHour: String!, subjectId: ID!) : Schedule!
        deleteSchedule(id: ID!) : Schedule!

        createTask(subjectId: ID!, assignment: String!, description: String!, deadline: String!) : Task!

        createUserFromGoogleAuth(name: String!, lastName: String!, email: String!, token: String!) : User
        createUserFromNormalSignUp(name: String!, lastName: String!, email: String!, password: String!, confirmPassword: String!) : User!
        editProfile(bio: String, carrer: String, facebookURL: String, linkedinURL: String, twitterURL: String) : Profile

        followUser(followed: String!) : Follow
    },
`;
