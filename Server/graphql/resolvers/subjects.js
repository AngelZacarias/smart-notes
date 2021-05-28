const Subject = require('../../models/Subject');
const User = require("../../models/User");
var _ = require('lodash');
module.exports = {
    Query: {
        async getSubjects(){
            try {
                const subjects = await Subject.find();
                return subjects;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getSubject(parent, {subjectId}, context, info){
            try{
                const subject = await Subject.findById(subjectId);
                if(subject){
                    return subject;
                }
                else{
                    throw new Error("Subject not found");
                }
            } catch (err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createSubject(parent, args, context, info){
            //Validate data
            if(args.name==="" || args.color===""){
                throw new Error("All fields are required");
            }
            //Save
            const newSubject = new Subject({
                name: args.name,
                color: args.color,
                active: true,
                createdAt: new Date().toISOString()
            });
            const response = await newSubject.save();
            return{
                ...response._doc,
                id: response._id
            }
        },

        async createUserFromGoogleAuth(parent, args, context, info){
          //¿Y si cambian el nombre de la cuenta de google?
          const email = args.email;
          try {
            const user = await User.findOne({ email });
            if (user) 
              throw new Error("User already exists")
          } catch(err) {
            throw new Error(err);
          }
          //Meter en el context el token
          if(_.some(args, _.isEmpty)) 
            throw new Error("Wrong user's data");
          
          args.name = _.camelCase
          const newUser = new User({
            name: args.name, //Cambiar el nombre a primera capital las demás minúsculas
            lastName: args.lastName, //Hacer que solo sea un apellido
            email: args.email,
            password: "", //Porque viene de googleauth
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          const response = await newUser.save();
          return {
            ...response._doc,
            id: response._id
          };
        },
    }
}