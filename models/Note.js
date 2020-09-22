const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    notebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notebook'
    },
    title: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('note', NoteSchema);