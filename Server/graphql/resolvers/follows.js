import { isValidObjectId } from "mongoose";
import Follow from "../../models/Follow";
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
          userFollower = await User.findOne({
            "_id": ObjectId(user.id)
          });
          userFollowed = await User.findOne({
            "_id": ObjectId(followed)
          });
          newFollow = createFollow(userFollower, userFollowed);
          await newFollow.save();
          return newFollow;
        }
      } catch (error) {
        throw new Error("Error al intentar seguir usuario")
      }
      return null;
    }
  }
}