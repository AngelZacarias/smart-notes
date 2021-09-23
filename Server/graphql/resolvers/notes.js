const { Query } = require('mongoose');
const Note = require('../../models/Note');
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Query: {
    async getNotes(parent, args, context, info){
      // Validate User
      checkAuth(context);
      try {
          if(args.subjectId === ""){
              throw new Error("The subjectId must be provided");
          }
          const subjectNotes = await Note.find({subject: args.subjectId});
          return subjectNotes;
      } catch (err) {
          throw new Error(err);
      }
    },
    async getNote(parent, args, context, info){
      // Validate User
      const user = checkAuth(context);
      try {
          if(!(args.id === "")){
              throw new Error("The note id must be provided");
          }
          const myNote = await Note.find({id: args.id});
          return myNote;
      } catch (err) {
          throw new Error(err);
      }
    }
  },
  Mutation:{
    async createOrUpdateNote(parent, args, context, info){
      try{
        // Validate User
        const user = checkAuth(context);
        // Validate data
        if(args.subjectId===""){
          throw new Error("The subject id must be provided");
        }
        if(args.plainTextNote===""){
          throw new Error("The plain text note must be provided");
        }
        if(args.richTextNote===""){
          throw new Error("The rich text note must be provided");
        }        
        // UPDATE
        if(args.id!==""){
          console.log("Update")
          const response = await Note.findByIdAndUpdate(
            args.id, 
            {
              richTextNote: args.richTextNote,
              plainTextNote: args.plainTextNote,
              subject: args.subjectId,
              user: user.id,
              createdAt: new Date().toISOString(),
            },
            { new: true },
          );
          return{
            ...response._doc,
            id: response._id
          }
        }
        else{ //CREATE
          console.log("Create")
          const newNote = new Note({
            richTextNote: args.richTextNote,
            plainTextNote: args.plainTextNote,
            subject: args.subjectId,
            user: user.id,
            createdAt: new Date().toISOString(),
          });
          const response = await newNote.save();
          return{
            ...response._doc,
            id: response._id
          }
        }
      }
      catch(err){
        console.log("Error creating or updating a note", err)
        throw new Error(err);
      }
    },
    async deleteNote(parent, args, context, info){
      try{
        // Validate User
        checkAuth(context);
        // Validate data
        if(args.id===""){
          throw new Error("The note id must be provided");
        }
        else{
          const response = await Note.findOneAndDelete({_id: args.id});
          return{
            ...response._doc,
            id: response._id
          }
        }
      }
      catch(err){
        console.log("Error deleting a note")
        throw new Error(err);
      }
    }
  }
}
