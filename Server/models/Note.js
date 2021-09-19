const { model, Schema } = require('mongoose');

const noteSchema = new Schema({
    richTextNote: {
        type: String,
        default: "",
    },
    plainTextNote: {
        type: String,
        default: "",
    },
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