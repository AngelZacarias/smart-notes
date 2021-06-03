const User = require("../../models/User");
var _ = require("lodash");
const bcrypt = require("bcrypt");
const { formatName } = require("../../utils/format-names");
const { createUserPayload } = require("../../services/user/user-service");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    async normalLogin(parent, args, context, info) {
      const email = args.email;
      let user;
      console.log(args);
      try {
        user = await User.findOne({ email });
      } catch (err) {
        console.log(err);
      }
      if (!user) throw new Error("No estás registrado");
      if (_.isEmpty(user.password))
        throw new Error("Debes loguearte con Google");
      const isSamePassword = await bcrypt.compare(args.password, user.password);
      if (isSamePassword) {
        const userPayload = createUserPayload(user);
        const token = jwt.sign(userPayload, process.env.JWT_KEY, {
          expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
        });
        console.log("Token creado:", token);
        return {
          token,
        };
      } else throw new Error("Contraseña incorrecta");
    },
  },
  Mutation: {
    async createUserFromGoogleAuth(parent, args, context, info) {
      const email = args.email;
      try {
        const user = await User.findOne({ email });
        if (user) {
          user.token = args.token;
          return user;
        }
      } catch (err) {
        throw new Error(err);
      }
      if (_.some(args, _.isEmpty)) throw new Error("Wrong user's data");
      args.name = formatName(args.name);
      args.lastName = formatName(args.lastName);

      const newUser = new User({
        name: args.name,
        lastName: args.lastName,
        email: args.email,
        password: "",
        active: true,
        normalAuth: false, //Because this comes from google auth
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const response = await newUser.save();
      return {
        ...response._doc,
        id: response._id,
        token: args.token,
      };
    },

    async createUserFromNormalSignUp(parent, args, context, info) {
      const email = args.email;
      let password = args.password;
      let response;
      let user;
      try {
        user = await User.findOne({ email });
      } catch (err) {
        throw new Error(err);
      }
      if (user) 
        throw new Error("Usuario ya registrado")
      args.name = formatName(args.name);
      args.lastName = formatName(args.lastName);

      const saltRounds = await bcrypt.genSalt(
        parseInt(process.env.HASH_SALT_ROUNDS)
      );
      args.password = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        name: args.name,
        lastName: args.lastName,
        email: args.email,
        password: args.password,
        active: true,
        normalAuth: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      try {
        response = await newUser.save();
      } catch (err) {
        throw new Error("Error saving user to DB");
      }
      return {
        ...response._doc,
        id: response._id,
      };
    },
  },
};
