import React from 'react';

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

const Editor = ({enable, content, loading, contentChange}) => {
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
                    console.log('onchange');
                    
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

export default Editor;