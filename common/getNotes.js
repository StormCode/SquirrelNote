const Note = require('../models/Note');

module.exports = async function(notedirs) {
    let notes = [];
    for(let idx = 0; idx < notedirs.length; idx++){
        let notedir = notedirs[idx];
        let noteItems = await Note.find({notedir: notedir._id});
        noteItems && noteItems.map(noteItem => notes.push(noteItem));
    }
    return notes;
}