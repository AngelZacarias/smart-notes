const { model, Schema } = require('mongoose');

const subjectSchema = new Schema({
    name : String,
    color: String,
    active: Boolean,
    createdAt: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Subject', subjectSchema);