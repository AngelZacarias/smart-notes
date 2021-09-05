const { model, Schema } = require('mongoose');

const scheduleSchema = new Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    startHour: {
        type: String,
        required: true,
        //match: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
    },
    endHour: {
        type: String,
        required: true,
        //match: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
    },
    createdAt: String,
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subjects',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
});

module.exports = model('Schedule', scheduleSchema);