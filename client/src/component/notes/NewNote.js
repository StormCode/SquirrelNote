import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Note from './Note';

const NewNote = ({ addNoteVisible }) => {

    const [newNoteContent, setNewNoteContent] = useState({
        title: '',
        content: ''
    });

    const setNoteContent = note => {
        setNewNoteContent(note);
    };

    return (
        <Fragment>
            {addNoteVisible ? (<Note key='newnote' note={newNoteContent} setCurrentNote={setNoteContent} />) : null}
        </Fragment>
    )
}

NewNote.propTypes = {
    addNoteVisible: PropTypes.bool.isRequired
};

const mapStateProps = state => ({
    addNoteVisible: state.notes.addNoteVisible
});

export default connect(
    mapStateProps
)(NewNote);