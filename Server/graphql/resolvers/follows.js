import Follow from "../../models/Follow";
const checkAuth = require("../../utils/check-auth");
import { createFollow } from "../../services/follow/follow-service";

module.exports = {
  // Query: {},
  Mutation: {
    async followUser(parent, args, context, info) {
      const user = checkAuth(context);
      const followed = args.followed;
      let newFollow;
      if (user.id == followed) 
        throw new Error("No puedes seguirte a ti mismo")
      try {
        const follow = await Follow.findOne({ followed });
        if (follow) 
          await Follow.deleteOne(follow);
        else {
          newFollow = createFollow(user.id, followed);
          await newFollow.save();
          return newFollow;
        }
      } catch (error) {
        throw new Error("Error intentar seguir usuario")
      }
      return null;
    }
  }
}