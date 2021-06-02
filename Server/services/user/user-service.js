const jwt = require("jsonwebtoken");

function createUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
  }
}

function getUser(token) {
  jwt.decode(token, { json: true });
}

module.exports = { createUserPayload, getUser };