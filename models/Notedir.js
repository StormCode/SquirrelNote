const mongoose = require('mongoose');

const NotedirSchema = mongoose.Schema({
    notebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notebook'
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: String,
        summary: String,
        date: Date
    }]
});

module.exports = mongoose.model('notedir', NotedirSchema);