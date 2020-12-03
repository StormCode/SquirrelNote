import React, { Fragment, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, Trash, Check, X } from "phosphor-react";
import EDToolPanel from '../layout/EDToolPanel';

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

const { orange, gray } = theme;

const NoteDirContainer = styled.li`
    cursor: pointer;
    background-color: ${props => props.isCurrent ? orange : 'none'};
    color: ${props => props.isCurrent ? '#FFF' : gray};
    padding: 10px 0 10px 10px;
    font-size: 1rem;
    height: auto;
    &:hover {
        background-color: ${props => props.isCurrent ? '#FFF' : 'none'};
        color: ${orange};
    };

        .text-container,
        .toolpanel-container {
            position: relative;
        }

        .text-container {
            width: 10ch;
        }

            .text-container p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        .toolpanel-container {
            width: 100%;
        }
`;

const Notedir = props => {
    const [notedir, setNotedir] = useState({
        ...props.notedir
    });
    
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

    const notebookContext = useContext(NotebookContext);
    const notedirContext = useContext(NotedirContext);

    const currentNotebookId = notebookContext.current ? notebookContext.current._id : null;
    const currentNotedirId = notedirContext.current ? notedirContext.current._id : null;
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
    },[currentEditNotedir, currentDeleteNotedir]);

    const onClick = e => {
        e.preventDefault();
        props.setCurrent(_id);
    }

    const onEdit = () => {
        let notedirUpdateData = {
            title,
            notebook: currentNotebookId
        }; 
        //對點擊編輯的那一個筆記目錄執行update
        // currentEditNotedir === _id ? 
        //     //檢查內容是否有被改過，若有被改過才執行update，否則復原到原本的狀態
        //     title !== props.notedir.title
        //         ? updateNotedir(_id, notedirUpdateData) : disableEditNotedir()
        // : enableEditNotedir(_id);
        // if(currentEditNotedir === _id) {
        //     //檢查內容是否有被改過，若有被改過才執行update，否則復原到原本的狀態
        //     if(title !== props.notedir.title) {
        //         await updateNotedir(_id, notedirUpdateData);
        //         return error ? false : true;
        //     }else{
        //         disableEditNotedir();
        //         return true;
        //     }
        // }else{
        //     enableEditNotedir(_id);
        //     return false;
        // }
        
        if(currentEditNotedir === _id && title !== props.notedir.title) {
            updateNotedir(_id, notedirUpdateData);
        }

        disableEditNotedir();
        props.setToolPanel(null);
    };

    const onDelete = () => {
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotedir === _id){
            deleteNotedir(_id, currentNotebookId);
        }

        disableDeleteNotedir();
        props.setToolPanel(null);
    };
    
    //滑鼠移過顯示toolpanel
    const cardHoverOn = e => {
        e.preventDefault();
        console.log('hover');
        
        setVisible(true);
    }

    //滑鼠移出隱藏toolpanel
    const cardHoverOff = e => {
        e.preventDefault();
        setVisible(false);
    }

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, ['confirm']: orange});
        },
        'cancel': () => {
            setColor({...defaultColor, ['cancel']: orange});
        },
        'edit': () => { 
            setColor({...defaultColor, ['edit']: orange});
        },
        'delete': () => {
            setColor({...defaultColor, ['delete']: orange});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const onChange = e => {
        e.preventDefault();
        setNotedir({...notedir, [e.target.name]:e.target.value});
    }

    const onEnter = (operator) => {
        operator === 'edit' ? enableEditNotedir(_id) : enableDeleteNotedir(_id);
        //設定目前正在使用的ToolPanel
        props.setToolPanel(_id);
    }

    const onCancel = () => {
        currentEditNotedir === _id && disableEditNotedir();
        currentDeleteNotedir === _id && disableDeleteNotedir();
        //設回原本筆記目錄內容
        setNotedir({
            title: props.notedir.title
        });
        //取消目前正在使用的ToolPanel
        props.setToolPanel(null);
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
            onMouseLeave={cardHoverOff} 
            onClick={onClick}>
            { notedir !== null ?
            <Fragment>
                <div className='toolpanel-container'>
                    <EDToolPanel 
                        isEnter={props.toolPanel === _id} 
                        visible={visible} 
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onEnter={onEnter}
                        onCancel={onCancel}>
                        <EDToolPanel.ConfirmBtn>
                            <BtnContent onChange={iconChange.confirm} children={<Check size={20} color={color.confirm} weight='bold' />} />
                        </EDToolPanel.ConfirmBtn>
                        <EDToolPanel.CancelBtn>
                            <BtnContent onChange={iconChange.cancel} children={<X size={20} color={color.cancel} weight='bold' />} />
                        </EDToolPanel.CancelBtn>
                        <EDToolPanel.EditBtn>
                            <BtnContent onChange={iconChange.edit} children={<Pencil size={20} color={color.edit} weight='bold' />} />
                        </EDToolPanel.EditBtn>
                        <EDToolPanel.DeleteBtn>
                            <BtnContent onChange={iconChange.delete} children={<Trash size={20} color={color.delete} weight='bold' />} />
                        </EDToolPanel.DeleteBtn>
                    </EDToolPanel>
                </div>
                <div className='text-container'>
                    {editNotedirVisible && 
                        (<input type='text' 
                            name='title' 
                            placeholder='請輸入資料夾名稱' 
                            value={title} 
                            onChange={onChange} />)
                    || deleteNotedirVisible && 
                        (<p className='warning'>確定要刪除{props.notedir.title}嗎?</p>) 
                    || (<p>{props.notedir.title}</p>)}
                </div>
            </Fragment>
                // (<div style={{position: 'relative'}} onClick={props.setCurrent}>
                //     {editNotedirVisible ? 
                //         (<Fragment>
                //             <div className='tool-panel' style={toolPanelStyle}>
                //                 <button id='edit-confirm-btn' onClick={onEdit}><img src={confirmImgSrc} alt='完成編輯' /></button>
                //                 <button id='cancel-btn' onClick={onCancel}><img src={cancelImgSrc} alt='取消' /></button>
                //             </div>
                //             <input type='text' 
                //                 name='title' 
                //                 placeholder='請輸入資料夾名稱' 
                //                 value={title} 
                //                 onChange={onChange} />
                //         </Fragment>) 
                //     : (deleteNotedirVisible ? 
                //         (<Fragment>   
                //             <p className='warning'>確定要刪除{title}嗎?</p>
                //             <button onClick={onDelete}><img src={confirmImgSrc} alt='確定刪除' /></button>
                //             <button onClick={onCancel}><img src={cancelImgSrc} alt='取消' /></button>
                //         </Fragment>)
                //         : (<Fragment>
                //             <div className='tool-panel' style={toolPanelStyle}>
                //                 <button id='edit-btn' onClick={onEdit}><img src={editImgSrc} alt='編輯' /></button>
                //                 <button id='delete-btn' onClick={onDelete}><img src={deleteImgSrc} alt='刪除' /></button>
                //             </div>
                //             <p>{props.notedir.title}</p>
                //         </Fragment>))}
                    
                // </div>)
            : null }
        </NoteDirContainer>
    )
}

export default Notedir;