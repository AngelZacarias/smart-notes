import Follow from "../../models/Follow";
import User from "../../models/User";
const checkAuth = require("../../utils/check-auth");
import { createFollow } from "../../services/follow/follow-service";
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  // Query: {},
  Mutation: {
    async followUser(parent, args, context, info) {
      const user = checkAuth(context);
      const followed = args.followed;
      let newFollow, userFollower, userFollowed;
      if (user.id == followed) 
        throw new Error("No puedes seguirte a ti mismo")
      try {
        const follow = await Follow.findOne({ followed });
        if (follow) 
          await Follow.deleteOne(follow);
        else {
          userFollower = await User.findById(user.id);
          userFollowed = await User.findById(followed);
          newFollow = createFollow(userFollower, userFollowed);
          await newFollow.save();
          return newFollow;
        }
      } catch (error) {
        throw new Error("Error al intentar seguir usuario")
      }
      return null;
    }
  },

  //Resolvers for nested queries
  NestedFollowerReference: {
    async follower(parent, args, context, info) {
      return await User.findById(parent.follower);
    },
  },

  NestedFollowedReference: {
    async followed(parent, args, context, info) {
      return await User.findById(parent.followed);
    },
  },
}