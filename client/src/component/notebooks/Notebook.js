import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, UncontrolledTooltip 
  } from 'reactstrap';
import { Pencil, Trash, Check, X } from "phosphor-react";
import EDToolPanel from '../layout/EDToolPanel';

// Import Style
import { theme } from '../../style/themes';
import NotebookContainer from '../../style/components/Notebook';

import NotebookContext from '../../context/notebooks/notebookContext';

const { orange, gray } = theme;

const Notebook = props => {
    const notebookContext = useContext(NotebookContext);

    const { currentEditNotebook,
        currentDeleteNotebook,
        enableEditNotebook,
        disableEditNotebook,
        enableDeleteNotebook,
        disableDeleteNotebook,
        updateNotebook, 
        deleteNotebook
    } = notebookContext;

    const [notebook, setNotebook] = useState({
        ...props.notebook
    });

    const { _id, title, desc } = notebook;

    useEffect(() => {
        //依目前編輯的狀態切換是否顯示編輯
        currentEditNotebook === _id ? setEditNotebookVisible(true) : setEditNotebookVisible(false);

        //依目前刪除的狀態切換是否顯示刪除
        currentDeleteNotebook === _id ? setDeleteNotebookVisible(true) : setDeleteNotebookVisible(false);
    },[currentEditNotebook, currentDeleteNotebook]);

    const [editNotebookVisible, setEditNotebookVisible] = useState(false);
    const [deleteNotebookVisible, setDeleteNotebookVisible] = useState(false);

    //ToolPanel的可見狀態
    const [visible, setVisible] = useState(false);

    const defaultColor = {
        edit: gray,
        delete: gray,
        confirm: gray,
        cancel: gray
    };

    const [color, setColor] = useState(defaultColor);

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

    const history = useHistory();

    const LoadNotebook = () => {
        history.push(`/notebook/${_id}`);
    }

    //對已選編輯的筆記本執行編輯
    const onEdit = () => {
        //對點擊編輯的那一個筆記本執行update
        if(currentEditNotebook === _id 
            && (title !== props.notebook.title 
            || desc !== props.notebook.desc)) {
                updateNotebook(_id, notebook);
        }

        disableEditNotebook();
        props.setToolPanel(null);
    }

    //對已選刪除的筆記本執行刪除
    const onDelete = () => {
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotebook === _id){
            deleteNotebook(_id);
        }

        disableDeleteNotebook();
        setVisible(true);
        props.setToolPanel(null);
    }

    const onChange = e => {
        e.preventDefault();
        setNotebook({...notebook, [e.target.name]:e.target.value});
    }

    const onEnter = operator => {
        if(operator === 'edit') {
            enableEditNotebook(_id);
        } else {
            enableDeleteNotebook(_id);
            setVisible(false);
        }
        //設定目前正在使用的ToolPanel
        props.setToolPanel(_id);
    }

    const onCancel = () => {
        currentEditNotebook === _id && disableEditNotebook();
        if(currentDeleteNotebook === _id) {
            disableDeleteNotebook();
            setVisible(true);
        }
        //設回原本筆記本內容
        setNotebook({
            title: props.notebook.title,
            desc: props.notebook.desc
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
        <NotebookContainer className={[deleteNotebookVisible ? 'danger-alert' : null,'notebook'].join(' ').replace(/^[\s]/,'')}>
            <Card
                onMouseEnter={cardHoverOn}
                onMouseLeave={cardHoverOff}>
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
                {/* { editNotebookVisible ? 
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
                } */}
                {/* todo: 加入封面 */}
                {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
                <CardBody onClick={props.toolPanel !== _id ? LoadNotebook : null}>
                    {/* <CardTitle>{editNotebookVisible ? 
                        (<input type='text' 
                            className='form-control' 
                            name='title' 
                            placeholder='名稱' 
                            value={title} 
                            onChange={onChange} />
                        ) : props.notebook.title}</CardTitle>
                    <CardText>{editNotebookVisible ? 
                        (<textarea className='form-control' 
                            rows={3} 
                            name='desc' 
                            placeholder='描述' 
                            value={desc} 
                            onChange={onChange} />
                        ) : props.notebook.desc}</CardText>
                    {deleteNotebookVisible && (
                        <Fragment>
                            <p>確定要刪除{title}嗎?</p>
                            <Button outline color="danger" onClick={onDelete}>確定刪除</Button>
                            <Button outline color="primary" onClick={onCancel}>取消</Button>
                        </Fragment>
                    )} */}
                    <CardTitle>
                        {editNotebookVisible && 
                            (<input type='text' 
                                className='form-control' 
                                name='title' 
                                placeholder='名稱' 
                                value={title} 
                                onChange={onChange} />
                            )
                        || (<p>{props.notebook.title}</p>)}
                    </CardTitle>
                    <CardText>
                        {editNotebookVisible ? 
                            (<textarea className='form-control' 
                                rows={3} 
                                name='desc' 
                                placeholder='描述' 
                                value={desc} 
                                onChange={onChange} />
                            ) : props.notebook.desc}
                    </CardText>
                    {deleteNotebookVisible && (
                        <Fragment>
                            <p>確定要刪除{props.notebook.title}嗎?</p>
                            <Button outline color="danger" onClick={onDelete}>確定刪除</Button>
                            <Button outline color="primary" onClick={onCancel}>取消</Button>
                        </Fragment>
                    )}
                </CardBody>
            </Card>
        </NotebookContainer>
    )
}

export default Notebook;