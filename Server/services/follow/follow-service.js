const Follow = require("../../models/Follow");

function createFollow(follower, followed) {
  return new Follow({
    follower,
    followed
  });
}

module.exports = { createFollow };