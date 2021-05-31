const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email : String,
    password: String,
    active: Boolean,
    name: String,
    lastName: String,
    normalAuth: Boolean,
    createdAt: String,
    updatedAt: String,
});

module.exports = model('User', userSchema);