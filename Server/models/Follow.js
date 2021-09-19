const { model, Schema } = require("mongoose");

const followSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  //Properties to block or unblock chat
  followerAble: {
    type: Boolean,
    default: true,
  },
  followedAble: {
    type: Boolean,
    default: true,
  },
});

module.exports = model('Follow', followSchema);