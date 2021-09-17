import Follow from "../../models/Follow";
import User from "../../models/User";
import { createFollow } from "../../services/follow/follow-service";
const checkAuth = require("../../utils/check-auth");

module.exports = {
  Query: {
    async getFollow(parent, args, context, info) {
      const user = checkAuth(context);
      const followedId = args.followedId;
      let follow;
      try {
        follow = await Follow.findOne({
          follower: user.id,
          followed: followedId,
        });
        if (!follow) return null;
      } catch (error) {
        throw new Error("Error al obtener el follow");
      }
      return follow;
    },
  },
  Mutation: {
    async followUser(parent, args, context, info) {
      const user = checkAuth(context);
      const followed = args.followed;
      let newFollow, userFollower, userFollowed;
      if (user.id == followed) throw new Error("No puedes seguirte a ti mismo");
      try {
        const follow = await Follow.findOne({ follower: user.id, followed });
        if (follow) await Follow.deleteOne(follow);
        else {
          userFollower = await User.findById(user.id);
          userFollowed = await User.findById(followed);
          newFollow = createFollow(userFollower, userFollowed);
          await newFollow.save();
          return newFollow;
        }
      } catch (error) {
        throw new Error("Error al intentar seguir usuario");
      }
      return null;
    },
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
};
