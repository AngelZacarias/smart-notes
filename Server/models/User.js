const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        select: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
    },
    updatedAt: {
        type: String,
    },
    subjects: [{ 
        type: Schema.Types.ObjectId,
        ref: 'subjects'
    }],
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profiles',
    },
    normalAuth: Boolean,
});

module.exports = model('User', userSchema);