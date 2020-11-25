const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 2
    },
    activeToken: {
        type: String
    },
    activeExpires: {
        type: Number
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Number
    }
});

module.exports = mongoose.model('user', UserSchema);