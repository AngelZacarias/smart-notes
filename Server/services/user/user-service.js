const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");

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

module.exports = { createUserPayload, getUser, createUserProfile };