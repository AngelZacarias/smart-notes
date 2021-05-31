const User = require("../../models/User");
var _ = require('lodash');

module.exports = {
  Mutation:{

    async createUserFromGoogleAuth(parent, args, context, info){
      console.log(context);
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