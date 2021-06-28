const User = require("../../models/User");
const Profile = require("../../models/Profile")
var _ = require("lodash");
const bcrypt = require("bcrypt");
const { formatName } = require("../../utils/format-names");
const {
  createUserPayload,
  createUserProfile,
} = require("../../services/user/user-service");
const jwt = require("jsonwebtoken");
const checkAuth = require("../../utils/check-auth");
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  Query: {
    async normalLogin(parent, args, context, info) {
      const email = args.email;
      let user;
      try {
        user = await User.findOne({ email }).select("password");
      } catch (err) {
        console.log(err);
        throw new Error("Error con la Base de Datos");
      }
      if (!user) throw new Error("Dirección de correo no registrada");
      if (_.isEmpty(user.password))
        throw new Error("Debes loguearte con Google");
      const isSamePassword = await bcrypt.compare(args.password, user.password);
      if (isSamePassword) {
        const userPayload = createUserPayload(user);
        const token = jwt.sign(userPayload, process.env.JWT_KEY, {
          expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
        });
        return {
          token,
        };
      } else throw new Error("Contraseña incorrecta");
    },

    async getUser(parent, args, context, info) {
      let user;
      const email = args.email;
      try {
        user = await User.findOne({ email });
      } catch (err) {
        console.log(err);
      }
      return user;
    },

    async getUserProfile(parent, args, context, info) {
      const user = checkAuth(context);
      let userProfile;
      try {
        userProfile = await Profile.findOne({
          user: ObjectId(user.id),
        });
        console.log(userProfile);
      } catch (err) {
        console.log(err);
      }
      return userProfile;
    },
  },
  Mutation: {
    async createUserFromGoogleAuth(parent, args, context, info) {
      const email = args.email;
      let response;
      try {
        const user = await User.findOne({ email });
        if (user) {
          const userPayload = createUserPayload(user);
          const token = jwt.sign(userPayload, process.env.JWT_KEY, {
            expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
          });
          user.token = token;
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
      try {
        response = await newUser.save();
        const newProfile = await createUserProfile(newUser);
        newProfile.save();
      } catch (err) {
        throw new Error("Error saving user to DB:", err);
      }
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
      if (user) throw new Error("Usuario ya registrado");
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
        const newProfile = await createUserProfile(newUser);
        newProfile.save();
      } catch (err) {
        throw new Error("Error saving user to DB:", err);
      }
      return {
        ...response._doc,
        id: response._id,
      };
    },

    async editProfile(parent, args, context, info) {
      console.log(args);
    }
  },
  //Resolvers for nested queries
  NestedUserReference: {
    async user(parent, args, context, info){
        return await User.findById(parent.user);
  },
}
};
