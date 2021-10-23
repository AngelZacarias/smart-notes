const { model, Schema } = require('mongoose');

const chatSchema = new Schema({
    user1 : {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    user2 : {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    user1Able: {
        type: Boolean,
        required: true,
        default: true,
    },
    user2Able: {
        type: Boolean,
        required: true,
        default: true,
    },
    messages: [{ 
      type: Schema.Types.ObjectId,
      ref: 'chatMessages'
    }],
    createdAt: String,
    updatedAt: String,
});

module.exports = model('Chat', chatSchema);