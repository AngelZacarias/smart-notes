const { model, Schema } = require('mongoose');

const profileSchema = new Schema({
    bio:{
        type: String,
        defualt: "",
    },
    carrer: {
        type: String,
        default: "",
    },
    facebookURL:{
        type: String,
        default: "",
    },
    linkedinURL: {
        type: String,
        default: "",
    },
    twitterURL:{
        type: String,
        default: "",
    },
    createdAt: String,
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
});

module.exports = model('Profile', profileSchema);