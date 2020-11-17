const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    notedir: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notedir'
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('note', NoteSchema);