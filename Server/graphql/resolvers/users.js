const User = require("../../models/User");
var _ = require('lodash');
const bcrypt = require("bcrypt");

module.exports = {
  Query: {
    async normalLogin(parent, args, context, info) {
      console.log(args);
      /*
        To do:
        Research how to passport basic authenticate
        How to insert variables in req.context
        Make use of middlewares in GraphQL
        Think about how to use check-auth.js or modify it
      */
      try {

      } catch(err){
        console.log(err); //Edit this
      }
    }
  },
  Mutation:{
    async createUserFromGoogleAuth(parent, args, context, info){
      console.log(context);
      const email = args.email;
      try {
        const user = await User.findOne({ email });
        if (user) 
          return user;
      } catch(err) {
        throw new Error(err);
      }      
      if(_.some(args, _.isEmpty)) 
        throw new Error("Wrong user's data");         
      args.name = _.capitalize(args.name);
      args.lastName = _.capitalize(args.lastName);
      args.name = args.name.split(" ");
      args.name = args.name[0];
      args.lastName = args.lastName.split(" ");
      args.lastName = args.lastName[0];

      const newUser = new User({
        name: args.name,
        lastName: args.lastName,
        email: args.email,
        password: "",
        active: true,
        normalAuth: false, //Because this comes from google auth
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      const response = await newUser.save();
      return {
        ...response._doc,
        id: response._id
      };
    },

    async createUserFromNormalSignUp(parent, args, context, info) {
      const email = args.email;
      let password = args.password;
      let response;
      try {
        const user = await User.findOne({ email });
        if (user) 
          return user;
      } catch(err) {
        throw new Error(err);
      }
      args.name = _.capitalize(args.name);
      args.lastName = _.capitalize(args.lastName);
      args.name = args.name.split(" ");
      args.name = args.name[0];
      args.lastName = args.lastName.split(" ");
      args.lastName = args.lastName[0];

      const saltRounds = await bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS));
      args.password = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        name: args.name,
        lastName: args.lastName,
        email: args.email,
        password: args.password,
        active: true,
        normalAuth: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      try {
        response = await newUser.save();
      } catch(err) {
        throw new Error("Error saving user to DB");
      }
      return {
        ...response._doc,
        id: response._id
      };
    }
  }
}