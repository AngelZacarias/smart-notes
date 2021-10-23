const { model, Schema } = require('mongoose');

const chatMessageSchema = new Schema({
    userEmisor : {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    userReceptor : {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    message: {
        type: String,
        required: true,
        default: "",
    },
    read: {
        type: Boolean,
        required: true,
        default: true,
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chats',
    },
    createdAt: String,
});

module.exports = model('ChatMessage', chatMessageSchema);