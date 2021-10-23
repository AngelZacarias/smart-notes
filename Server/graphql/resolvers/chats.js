const { Query } = require('mongoose');
const { PubSub, withFilter } = require('apollo-server');
const Chat = require('../../models/Chat');
const checkAuth = require("../../utils/check-auth");

// Subscription's Publisher Object
const pubsub = new PubSub();

// Subscription Tags
const NEW_CHAT = 'NEW_CHAT';

module.exports = {
  Query: {
    async getChats(parent, args, context, info){
      //Validate User
      const user = checkAuth(context);
      try{
        const chats = await Chat.find({ $or: [{'user1': user.id}, {'user2':user.id}] }).sort('-updatedAt');
        return chats;
      } 
      catch (err){
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createChat(parent, args, context, info){
      //Validate User
      const user = checkAuth(context);
      if(args.userContactedId === ""){
          throw new Error("You must provide the user id you want to contact");
      }
      try{
          // Find or Create a register where user1==me && user2==contact or user1==contact && user2==me  
          const filter = {
            $or:
            [
              {
                $and:
                [
                  {'user1': args.userContactedId},
                  {'user2': user.id}
                ]
              },
              {
                $and:
                [
                  {'user2': args.userContactedId},
                  {'user1': user.id}
                ]
              }
            ]
          }
          //Look for the register
          let response = await Chat.findOne(filter).exec();
          if(response === null){
            //New Chat 
            const newChat = new Chat({
              user1: user.id,
              user2: args.userContactedId,
              userAble1: true,
              userAble2: true,
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            response = await newChat.save();

            //Sends the signal to the newChat subscription
            pubsub.publish(NEW_CHAT, {newChat: { 
              ...response._doc,
              id: response._id,
            }});
          }
          return{
              ...response._doc,
              id: response._id,
          };

      } catch (err){
          throw new Error(err);
      }
    }
  },
  NestedChatReference: {
    async chat(parent, args, context, info) {
      return await Chat.findById(parent.chat);
    },
  }
}
