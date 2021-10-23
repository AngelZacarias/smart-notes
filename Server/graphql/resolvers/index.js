import scheduleResolvers from './schedule';
import subjectsResolvers from './subjects';
import tasksResolvers from './tasks';
import noteResolvers from './notes';
import userResolvers from './users';
import followResolvers from './follows';
import chatResolvers from './chats';
import chatMessageResolvers from './chatMessages';

module.exports = {
    //Nested Queries
    Task: {
        //The subject owner for this task
        subject: subjectsResolvers.Task.subject,
        //The user owner for this task
        user: userResolvers.NestedUserReference.user,
    },
    //Nested Queries: 
    Subject: {
        //the user owner of this subject
        user: userResolvers.NestedUserReference.user,
        schedule: scheduleResolvers.Subject.schedule,
    },
    Schedule: {
        subject: subjectsResolvers.Task.subject,
    },
    Profile: {
        user: userResolvers.NestedUserReference.user,
    },
    Note: {
        subject: subjectsResolvers.NestedSubjectReference.subject,
        user: userResolvers.NestedUserReference.user,
    },
    User: {
      profile: userResolvers.NestedProfileReference.profile,
    },
    Follow: {
      follower: followResolvers.NestedFollowerReference.follower,
      followed: followResolvers.NestedFollowedReference.followed,
    },
    Chat: {
        user1: userResolvers.NestedUser1Reference.user,
        user2: userResolvers.NestedUser2Reference.user,
        messages: chatMessageResolvers.NestedMessagesReference.messages,
    },
    ChatMessage: {
        chat: chatResolvers.NestedChatReference.chat,
        userEmisor: userResolvers.NestedUserEmisorReference.user,
        userReceptor: userResolvers.NestedUserReceptorReference.user
    },
    // Default Queries
    Query: {
        ...subjectsResolvers.Query,
        ...scheduleResolvers.Query,
        ...tasksResolvers.Query,
        ...userResolvers.Query,
        ...noteResolvers.Query,
        ...followResolvers.Query,
        ...chatResolvers.Query,
        ...chatMessageResolvers.Query
    },
    Mutation: {
        ...subjectsResolvers.Mutation,
        ...tasksResolvers.Mutation,
        ...userResolvers.Mutation,
        ...noteResolvers.Mutation,
        ...followResolvers.Mutation,
        ...chatResolvers.Mutation,
        ...chatMessageResolvers.Mutation
    },
    Subscription: {
        ...chatMessageResolvers.Subscription    },
}