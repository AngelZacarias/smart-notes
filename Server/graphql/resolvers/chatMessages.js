const { Query } = require('mongoose');
const { PubSub, withFilter } = require('apollo-server');
const chatMessage = require('../../models/ChatMessage');
const Chat = require('../../models/Chat');
const checkAuth = require("../../utils/check-auth");

// Subscription's Publisher Object
const pubsub = new PubSub();

// Subscription Tags
const NEW_MESSAGE = 'NEW_MESSAGE';
const NEW_CHAT = 'NEW_CHAT';

module.exports = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_MESSAGE]),
        (payload, args) => {
          //It returns the message only if the user 
          return ((payload.newMessage.chat).toString() === args.chatId)
        },
      )
    },
    newChat: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_CHAT]),
        (payload, args) => {
          //It returns the message only if the user is member of the chat
          return ((payload.newChat.user1).toString() === args.userId || (payload.newChat.user2).toString() === args.userId)
        },
      )
    },
  },
  Query: {
    async getChatMessages(parent, args, context, info){
      //Validate User
      const user = checkAuth(context);
      if(args.chatId === ""){
        throw new Error("You must provide the chat id");
      }
      try{
        const messages = await chatMessage.find({ 'chat': args.chatId }).sort('-createdAt');
        return messages;
      } 
      catch (err){
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async sendMessage(parent, args, context, info){
      //Validate User
      const user = checkAuth(context);
      if(args.chatId === ""){
        throw new Error("You must provide the chat id");
      }
      if(args.message === ""){
        throw new Error("You must provide a text message");
      }
      try{
        //Gets the chat
        const chat = await Chat.findById(args.chatId);
        const userReceptor = chat.user1 === user.id ? chat.user2 : chat.user1 ;

        //Create the message
        const newMessage = new chatMessage({
          userEmisor: user.id,
          userReceptor: userReceptor,
          message: args.message,
          read: false,
          chat: args.chatId,
          createdAt: new Date().toISOString(),
        });
        const message = await newMessage.save();

        if(message === null){
          throw new Error("An error ocurred trying to save the message");
        }

        //Push the schedule reference into our subject
        chat.messages.push(message._id);
        chat.updatedAt = new Date().toISOString();
        chat.save();
        
        //Sends the signal to the newMessage subscription
        pubsub.publish(NEW_MESSAGE, {newMessage: { 
          ...message._doc, 
          id: message._id,
        }});
        
        //Sends the signal to the newChat subscription
        pubsub.publish(NEW_CHAT, {newChat: { 
          ...chat._doc,
          id: chat._id,
        }});

        //Return the message
        return {
          ...message._doc,
          id: message._id,
      };
      } 
      catch (err){
        throw new Error(err);
      }
    }
  },
  NestedMessagesReference:{
    async messages(parent, args, context, info){
        try {
            if(parent.id === ""){
                throw new Error("The chat id must be provided");
            }
            const messages = await chatMessage.find({chat: parent.id}).sort('-createdAt');;
            return messages;
        } catch (err) {
            throw new Error(err);
        }
    },
  }
}
