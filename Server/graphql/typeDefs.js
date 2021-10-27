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
        richTextNote: String
        plainTextNote: String     
        user: User
        subject: Subject
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
        createTask(assignment: String!, description: String!, deadline: String!, subjectId: ID!): Task

        normalLogin(email: String!, password: String!): Token
        getUser(email: String!): User
        getUserProfile: Profile

        getNotes(subjectId: ID!): [Note]
        getNote(id: ID!): Note
        getProfiles(keyword: String!): [User]
        getProfileById(userId: ID!): Profile

        getFollow(followedId: String!): Follow

        getMyCurrentTasks(subjectId: ID!): [Task]
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

        createOrUpdateNote(id: ID, subjectId: ID!, plainTextNote: String!, richTextNote: String!): Note
        deleteNote(id: ID!): Note
        
        followUser(followed: String!) : Follow

    },
`;
