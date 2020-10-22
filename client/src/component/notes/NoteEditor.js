import React from 'react'

const NoteEditor = ({enable, content, loading, contentChange}) => {
    const onChange = e => {
        e.preventDefault();
        contentChange(e.target.value);
    }

    return (
        <div className='editor'>
            { !loading ? 
                <textarea 
                    className='form-control' 
                    rows={10} name='content' 
                    placeholder='寫點東西吧...'
                    value={content} 
                    onChange={onChange}
                    disabled={!enable} />
            : null}
        </div>
    )
}

export default NoteEditor;