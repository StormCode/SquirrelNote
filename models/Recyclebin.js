const mongoose = require('mongoose');

const RecyclebinSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [{
        type: Object,
        required: true
    }]
});

module.exports = mongoose.model('recyclebin', RecyclebinSchema);