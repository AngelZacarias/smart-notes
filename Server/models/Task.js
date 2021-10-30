const { model, Schema } = require('mongoose');

const taskSchema = new Schema({
    assignment: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "",
    },
    deadline: {
        type: Date,
        required: true,
        default: new Date(),
    },
    active:{
        type: Boolean,
        default: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subjects',
        required: true,
    },
});

module.exports = model('Task', taskSchema);