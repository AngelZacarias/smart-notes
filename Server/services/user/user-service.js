const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

function createUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
  }
}

function getUser(token) {
  jwt.decode(token, { json: true });
}

function createUserProfile(user) {
  const newProfile = new Profile({
    user
  });
  return newProfile;
}

async function getUserTaskOwner(userId) {
  const user = await User.findById(userId);
  return user;
}
module.exports = { createUserPayload, getUser, createUserProfile, getUserTaskOwner };