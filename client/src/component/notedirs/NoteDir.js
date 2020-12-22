import React, { Fragment, useCallback, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, Trash, Check, X } from "phosphor-react";
import EDToolPanel from '../general/EDToolPanel';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import Models from '../general/Models';

// Import Style
import { theme } from '../../style/themes';
import deleteStyle from '../../style/model/delete';
import NoteDirContainer from '../../style/components/Notedir';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

const { orange, gray } = theme;
const currentFontColor = '#FFF';

const Input = styled.input`
    background: none;
    border: none;
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const ToolPanelContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                display: block;
            `
        }, {
            constraint: 'min',
            width: '1280px',
            rules: `
                display: ${props.visible ? 'block' : 'none'};
            `
        }
    ]);
}

const ToolPanelContainer = styled.div`
    ${props => ToolPanelContainerResponsiveStyle(props)}
`;

const Notedir = props => {
    const noteContext = useContext(NoteContext);
    
    const {
        // cacheNotes
        cacheMap
    } = noteContext;

    const [notedir, setNotedir] = useState({
        ...props.notedir
    });
    const notebookId = props.notebookId;

    const { _id, title } = notedir;
    const [editNotedirVisible, setEditNotedirVisible] = useState(false);
    const [deleteNotedirVisible, setDeleteNotedirVisible] = useState(false);
    
    //ToolPanel的可見狀態
    const [visible, setVisible] = useState(false);
    
    const defaultColor = {
        edit: gray,
        delete: gray,
        confirm: gray,
        cancel: gray
    };
    
    const [color, setColor] = useState(defaultColor);
    
    const currentCacheNotes = cacheMap.get(_id) || [];      // 目前目錄裡的快取筆記
    const notedirContext = useContext(NotedirContext);

    const currentNotedirId = notedirContext.current ? notedirContext.current._id : null;
    const currentCacheNoteLength = currentCacheNotes.length;
    
    const { 
        currentEditNotedir,
        currentDeleteNotedir,
        enableEditNotedir,
        disableEditNotedir,
        enableDeleteNotedir,
        disableDeleteNotedir,
        updateNotedir,
        deleteNotedir
    } = notedirContext;

    useEffect(() => {
        return () =>　{
            setColor(defaultColor);
        }

        // eslint-disable-next-line
    },[]);


    useEffect(() => {
        //依目前編輯的狀態切換是否顯示編輯
        currentEditNotedir === _id ? setEditNotedirVisible(true) : setEditNotedirVisible(false);

        //依目前刪除的狀態切換是否顯示刪除
        currentDeleteNotedir === _id ? setDeleteNotedirVisible(true) : setDeleteNotedirVisible(false);
    },[currentEditNotedir, currentDeleteNotedir, _id]);
    
    const notedirTextRef = useCallback(inputElement => {
        if (inputElement) {
          inputElement.focus();
        }
      }, []);

    const onChange = e => {
        e.preventDefault();
        setNotedir({...notedir, 'title':e.target.value});
    }

    const onClick = e => {
        e.preventDefault();
        props.setCurrent(_id);
    }

    const onEdit = () => {
        let notedirUpdateData = {
            title,
            notebook: notebookId
        }; 

        if(currentEditNotedir === _id && title !== props.notedir.title) {
            updateNotedir(_id, notedirUpdateData);
        }

        disableEditNotedir();
        props.setToolPanel(null);
    };

    const onDelete = () => {
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotedir === _id){
            deleteNotedir(_id, notebookId);
        }
        
        disableDeleteNotedir();
        props.setToolPanel(null);
    };
    
    //滑鼠移過顯示toolpanel
    const cardHoverOn = e => {
        e.preventDefault();
        setVisible(true);
    }

    //滑鼠移出隱藏toolpanel
    const cardHoverOff = e => {
        e.preventDefault();
        setVisible(false);
    }

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, 'confirm': currentNotedirId === _id ? currentFontColor : orange});
        },
        'cancel': () => {
            setColor({...defaultColor, 'cancel': currentNotedirId === _id ? currentFontColor : orange});
        },
        'edit': () => { 
            setColor({...defaultColor, 'edit': currentNotedirId === _id ? currentFontColor : orange});
        },
        'delete': () => {
            setColor({...defaultColor, 'delete': currentNotedirId === _id ? currentFontColor : orange});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const onEnter = (operator) => {
        if(operator === 'edit') {
            enableEditNotedir(_id);
            //設定目前正在使用的ToolPanel
            props.setToolPanel(_id);
        } else if(operator === 'delete') {
            enableDeleteNotedir(_id);
        }
    }

    const onCancelEdit = () => {
        disableEditNotedir();

        //設回原本筆記目錄內容
        setNotedir({...props.notedir, 'title': props.notedir.title});

        //取消目前正在使用的ToolPanel
        props.setToolPanel(null);
    }

    const onCancelDelete = () => {
        disableDeleteNotedir();
    }

    const toggleDeleteOpen = () => {
        deleteNotedirVisible ? disableDeleteNotedir() : enableDeleteNotedir();
    }

    const BtnContent = ({onChange, children}) => {
        return <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                    {children}
                </span>};

    return (
        <NoteDirContainer
            isCurrent = {currentNotedirId === _id}
            onMouseEnter={cardHoverOn}
            onMouseLeave={cardHoverOff}>
            { notedir !== null ?
            <Fragment>
                <div className='toolpanel-container'>
                    <ToolPanelContainer visible={visible}>
                        <EDToolPanel 
                            isEnter={props.toolPanel === _id} 
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onEnter={onEnter}
                            onCancel={onCancelEdit}>
                            <EDToolPanel.ConfirmBtn>
                                <BtnContent onChange={iconChange.confirm} children={<Check size={22} color={color.confirm} />} />
                            </EDToolPanel.ConfirmBtn>
                            <EDToolPanel.CancelBtn>
                                <BtnContent onChange={iconChange.cancel} children={<X size={22} color={color.cancel} />} />
                            </EDToolPanel.CancelBtn>
                            <EDToolPanel.EditBtn>
                                <BtnContent onChange={iconChange.edit} children={<Pencil size={22} color={color.edit} />} />
                            </EDToolPanel.EditBtn>
                            <EDToolPanel.DeleteBtn>
                                <BtnContent onChange={iconChange.delete} children={<Trash size={22} color={color.delete} />} />
                            </EDToolPanel.DeleteBtn>
                        </EDToolPanel>
                    </ToolPanelContainer>
                </div>
                <div className='text-container'
                    onClick={onClick}>
                    {editNotedirVisible ? 
                        <Input type='text'
                            value={title}
                            ref={notedirTextRef}
                            placeholder='請輸入資料夾名稱'
                            onChange={onChange} />
                    : <Fragment>
                            <p>
                                {props.notedir.title}
                                {currentCacheNoteLength && currentCacheNoteLength > 0 ?
                                    <b className='unsaved-count-badge'>{currentCacheNoteLength}</b>
                                    : null
                                }
                            </p>
                        </Fragment>}
                </div>
                <p className='note-count-badge'>{props.notedir.note_count}</p>
                <Models
                    isOpen={deleteNotedirVisible}
                    toggleOpen={toggleDeleteOpen}
                    onConfirm={onDelete}
                    onCancel={onCancelDelete}
                    modelStyle={deleteStyle}>
                    <Models.Content>
                        <p>筆記目錄將會移動至回收站，確定刪除嗎？</p>
                    </Models.Content>
                    <Models.ConfirmBtn enable={true}>刪除</Models.ConfirmBtn>
                    <Models.CancelBtn>取消</Models.CancelBtn>
                </Models>
            </Fragment>
            : null }
        </NoteDirContainer>
    )
}

export default Notedir;