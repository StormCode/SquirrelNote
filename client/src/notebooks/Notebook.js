import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, UncontrolledTooltip 
  } from 'reactstrap';

import '../style/components/Notebook.css';
import editImg from '../assets/general/edit_32x32.png';
import deleteImg from '../assets/general/delete_32x32.png';
import confirmImg from '../assets/general/confirm_32x32.png';
import cancelImg from '../assets/general/close_32x32.png';

import NotebookContext from '../context/notebooks/notebookContext';

const Notebook = props => {
    const notebookContext = useContext(NotebookContext);

    const { currentEditNotebook,
        currentDeleteNotebook,
        enableEditNotebook,
        disableEditNotebook,
        enableDeleteNotebook,
        disableDeleteNotebook,
        updateNotebook, 
        deleteNotebook } = notebookContext;

    useEffect(() => {
        //依目前編輯的狀態切換是否顯示編輯
        currentEditNotebook === _id ? setEditNotebookVisible(true) : setEditNotebookVisible(false);

        //依目前刪除的狀態切換是否顯示刪除
        currentDeleteNotebook === _id ? setDeleteNotebookVisible(true) : setDeleteNotebookVisible(false);
    },[currentEditNotebook, currentDeleteNotebook]);

    const [editNotebookVisible, setEditNotebookVisible] = useState(false);
    const [deleteNotebookVisible, setDeleteNotebookVisible] = useState(false);

    const [notebook, setNotebook] = useState({
        ...props.notebook
    })

    const { _id, title, desc } = notebook;

    const [hover, setHover] = useState(false);

    //滑鼠移過顯示toolpanel
    const hoverOn = () => {
        setHover(true);
    }

    //滑鼠移出隱藏toolpanel
    const hoverOff = () => {
        setHover(false);
    }

    const loadNote = () => {
        props.history.push('/notebook');
    }

    //對已選編輯的筆記本執行編輯
    const onEdit = e => {
        e.preventDefault();
        //對點擊編輯的那一個筆記本執行update
        currentEditNotebook === _id ? 
            //檢查內容是否有被改過，若有被改過才執行update，否則復原到原本的狀態
            (title !== props.notebook.title 
            || desc !== props.notebook.desc)
                ? updateNotebook(notebook) : disableEditNotebook()
            : enableEditNotebook(_id);
    }

    //對已選刪除的筆記本執行刪除
    const onDelete = e => {
        e.preventDefault();
        //對點擊刪除的那一個筆記本執行delete
        currentDeleteNotebook === _id ? deleteNotebook(_id) : enableDeleteNotebook(_id);
    }

    const onChange = e => {
        e.preventDefault();
        setNotebook({...notebook, [e.target.name]:e.target.value});
    }

    const onCancel = () => {
        currentEditNotebook === _id && disableEditNotebook();
        currentDeleteNotebook === _id && disableDeleteNotebook();
    }

    const toolPanelStyle = {
        display: hover ? 'flex' : 'none'
    }

    return (
        <div className={[deleteNotebookVisible ? 'danger-alert' : null,'notebook'].join(' ').replace(/^[\s]/,'')}>
            <Card onClick={e => {
                e.target.name !== 'title' && e.target.name !== 'desc' 
                && e.target.type !== 'button' && loadNote()
            }}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}>
                { editNotebookVisible ? 
                    (<div className='tool-panel' style={toolPanelStyle}>
                        <button id='edit-confirm-btn' onClick={onEdit}><img src={confirmImg} alt='完成編輯' /></button>
                        <button id='cancel-btn' onClick={onCancel}><img src={cancelImg} alt='取消' /></button>
                        <UncontrolledTooltip placement="bottom" target="edit-confirm-btn">
                            完成編輯
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="bottom" target="cancel-btn">
                            取消
                        </UncontrolledTooltip>
                    </div>) : 
                    !deleteNotebookVisible && (
                    <div className='tool-panel' style={toolPanelStyle}>
                        <button id='edit-btn' onClick={onEdit}><img src={editImg} alt='編輯' /></button>
                        <button id='delete-btn' onClick={onDelete}><img src={deleteImg} alt='刪除' /></button>
                        <UncontrolledTooltip placement="bottom" target="edit-btn">
                            編輯
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="bottom" target="delete-btn">
                            刪除
                        </UncontrolledTooltip>
                    </div>)
                }
                {/* todo: 加入封面 */}
                {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
                <CardBody>
                    <CardTitle>{editNotebookVisible ? 
                        (<input type='text' 
                            className='form-control' 
                            name='title' 
                            placeholder='名稱' 
                            value={title} 
                            onChange={onChange} />
                        ) : title}</CardTitle>
                    <CardText>{editNotebookVisible ? 
                        (<textarea className='form-control' 
                            rows={3} 
                            name='desc' 
                            placeholder='描述' 
                            value={desc} 
                            onChange={onChange} />
                        ) : desc}</CardText>
                    {deleteNotebookVisible && (
                        <Fragment>
                            <p>確定要刪除{title}嗎?</p>
                            <Button outline color="danger" onClick={onDelete}>確定刪除</Button>
                            <Button outline color="primary" onClick={onCancel}>取消</Button>
                        </Fragment>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Notebook;