const { model, Schema } = require('mongoose');

const subjectSchema = new Schema({
    name : {
        type: String,
        required: true,
        default: "Materia",
    },
    color: {
        type: String,
        required: true,
        default: "primary",
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    schedules: [{
        type: Schema.Types.ObjectId,
        ref: 'schedules'
    }],
});

module.exports = model('Subject', subjectSchema);