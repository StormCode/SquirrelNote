import React, { useState, useEffect } from 'react';

/********* CKEditor *********/
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';

import UploadAdapter from '../../utils/uploadAdapter';

const NoteEditor = ({enable, content, loading, contentChange, autoSave, autoSaveInterval, saveEvent}) => {

    let autoSaveIntervalToken;
    
    // const [editorData, setEditorData] = useState(content);
    // const [editorData, setEditorData] = useState('<p>Squirrel Note</p>');
    
    // 自訂Upload Adapter
    function UploadAdapterPlugin( editor ) {
      editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new UploadAdapter( loader );
      };
    }

    const editorConfiguration = {
        plugins: [ Essentials, Bold, Italic, Paragraph, Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload ],
        toolbar: [ 'bold', 'italic', 'imageUpload' ],
        extraPlugins: [ UploadAdapterPlugin ]
    };
      
    function AutoSave(saveCB, interval, enable) {
        if(enable){
            console.log('autosave launch');
            
            autoSaveIntervalToken = setInterval(saveCB, interval);
        }
        else{
            console.log('auto closed');
            
            clearInterval(autoSaveIntervalToken);
        }
    }

    useEffect(() => {

        // clear autosave interval token
        autoSaveIntervalToken && clearInterval(autoSaveIntervalToken);
    
        // 當自動儲存開啟/關閉改變時執行(清除setinterval或設定setinterval)
        AutoSave(saveEvent, autoSaveInterval, autoSave);
    
    }, [autoSave, saveEvent]);

    return (
        <div className='editor'>
            { !loading ? 
            <CKEditor
                editor={ ClassicEditor }
                config={ editorConfiguration }
                data={content}
                disabled={!enable} 
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    contentChange(data);
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
            : null}
        </div>
    )
}

export default NoteEditor;