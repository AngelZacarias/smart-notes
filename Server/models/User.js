const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
        match: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
    },
    password: {
        type: String,
        required: true,
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
        ref: 'profile',
        required: true,
    },
});

module.exports = model('User', userSchema);