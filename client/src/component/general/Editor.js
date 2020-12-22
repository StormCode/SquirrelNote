import React from 'react';

/********* CKEditor *********/
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';

import UploadAdapter from '../../utils/uploadAdapter';

import styled from 'styled-components';

const EditorContainer = styled.div`
    > .ck-editor {
        height: 100%;
    }

        > .ck-editor > .ck-editor__main,
        > .ck-editor > .ck-editor__main > .ck-editor__editable_inline {
            flex: 1 1 100%;
            overflow-y: auto;
        }

    > .ck-editor,
    > .ck-editor > .ck-editor__main {
        display: flex;
        flex-flow: column nowrap;
    }
`;

const Editor = ({enable, content, loading, contentChange, onDoubleClick}) => {
    // 自訂Upload Adapter
    function UploadAdapterPlugin( editor ) {
      editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new UploadAdapter( loader );
      };
    }

    const editorConfiguration = {
        plugins: [ 
	        Alignment,
            BlockQuote,
            Bold, 
            CodeBlock,
            Essentials, 
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            Heading,
            Image, 
            ImageCaption, 
            ImageStyle, 
            ImageToolbar, 
            ImageUpload, 
            Indent, 
            Italic, 
            Link,
            List,
            MediaEmbed,
            Paragraph, 
            PasteFromOffice,
            Table,
            TableToolbar,
            TextTransformation,
            Underline
        ],
        toolbar: [
            'bold',
            'italic',
            'underline',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            'indent',
            'outdent',
            '|',
            'fontColor',
            'fontSize',
            'fontFamily',
            'fontBackgroundColor',
            '|',
            'blockQuote',
            'insertTable',
            'codeBlock',
            'imageUpload',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
        ],
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        extraPlugins: [ UploadAdapterPlugin ]
    };

    return (
        <EditorContainer className='editor' onDoubleClick={onDoubleClick}>
            { !loading ? 
            <CKEditor
                editor={ ClassicEditor }
                config={ editorConfiguration }
                data={content}
                disabled={!enable} 
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    data !== content && contentChange(data);
                } }
            />
            : null}
        </EditorContainer>
    )
}

export default Editor;