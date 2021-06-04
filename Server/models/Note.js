const { model, Schema } = require('mongoose');

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
    }],
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subjects',
        required: true,
    },
});

module.exports = model('Note', noteSchema);