import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import EDToolPanel from '../layout/EDToolPanel';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

// Import Resource
import editImgSrc from '../../assets/general/edit_32x32.png';
import deleteImgSrc from '../../assets/general/delete_32x32.png';
import confirmImgSrc from '../../assets/general/confirm_32x32.png';
import cancelImgSrc from '../../assets/general/close_32x32.png';

const NoteDirContainer = styled.li`
    background-color: ${props => props.isCurrent ? props.theme.lightGreen : props.theme.gray};
    height: auto;
    &:hover {
        background-color: ${props => props.isCurrent ? props.theme.lightGreenOnHover : props.theme.gray};
    };
`;

const Notedir = (props) => {
    const [notedir, setNotedir] = useState({
        ...props.notedir
    });
    
    const { _id, title } = notedir;
    const [editNotedirVisible, setEditNotedirVisible] = useState(false);
    const [deleteNotedirVisible, setDeleteNotedirVisible] = useState(false);

    //ToolPanel的可見狀態
    const [visible, setVisible] = useState(false);
    
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
        deleteNotedir,
        error 
    } = notedirContext;

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

    const onEdit = async e => {
        e.preventDefault();
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
            await updateNotedir(_id, notedirUpdateData);
            if(error){
                return false;
            }
        }

        disableEditNotedir();
        props.setToolPanel(null);
        return true;
    };

    const onDelete = async e => {
        e.preventDefault();
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotedir === _id){
            await deleteNotedir(_id, currentNotebookId);
            if(error){
                return false;
            }
        }

        disableDeleteNotedir();
        props.setToolPanel(null);
        return true;
    };
    
    const hoverOn = e => {
        e.preventDefault();
        setVisible(true);
    }

    const hoverOff = e => {
        e.preventDefault();
        setVisible(false);
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

    return (
        <NoteDirContainer
            isCurrent = {currentNotedirId === _id}
            onMouseOver={hoverOn}
            onMouseLeave={hoverOff}>
            { notedir !== null ?
            <div style={{position: 'relative'}} onClick={onClick}>
                <EDToolPanel 
                    isEnter={props.toolPanel === _id} 
                    visible={visible} 
                    editImgSrc={editImgSrc} 
                    deleteImgSrc={deleteImgSrc} 
                    confirmImgSrc={confirmImgSrc} 
                    cancelImgSrc={cancelImgSrc}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onEnter={onEnter}
                    onCancel={onCancel} />
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