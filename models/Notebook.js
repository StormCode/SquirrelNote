const mongoose = require('mongoose');

const NotebookSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    notedirs: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        date: Date,
        default: Boolean
    }]
});

module.exports = mongoose.model('notebook', NotebookSchema);