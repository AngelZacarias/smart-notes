const { ValuesOfCorrectTypeRule } = require("graphql");
const User = require("../../models/User");

module.exports = {
  Mutation:{
    async createUserFromGoogleAuth(parent, args, context, info){
      // const argsArr = [...args]
      console.log(args);
      if(_.values(args).every(_.isEmpty)) {
        throw new Error("Wrong user's data");
      }
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
      return{
        ...response._doc,
        id: response._id
      };
      
    }
  }
}