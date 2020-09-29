import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';

import '../style/components/Notebook.css';

import NotebookContext from '../context/notebooks/notebookContext';

const Notebook = props => {
    const notebookContext = useContext(NotebookContext);

    const { currentEditNotebook,
        currentDeleteNotebook,
        enableEditNotebook,
        enableDeleteNotebook,
        updateNotebook, 
        deleteNotebook } = notebookContext;

    useEffect(() => {
        currentEditNotebook === _id ? setEditNotebookVisible(true) : setEditNotebookVisible(false);
        currentDeleteNotebook === _id ? setDeleteNotebookVisible(true) : setDeleteNotebookVisible(false);
    },[currentEditNotebook, currentDeleteNotebook]);

    const [editNotebookVisible, setEditNotebookVisible] = useState(false);
    const [deleteNotebookVisible, setDeleteNotebookVisible] = useState(false);

    const [notebook, setNotebook] = useState({
        ...props.notebook
    })

    const { _id, title, desc } = notebook;

    const [status, setStatus] = useState(null);

    const loadNote = () => {
        props.history.push('/notebook');
    }

    //已選編輯的狀態執行編輯筆記本，否則改變狀態為已選
    const onEdit = e => {
        e.preventDefault();
        currentEditNotebook === _id ? updateNotebook(notebook) : enableEditNotebook(_id);
    }

    //已選刪除的狀態執行刪除筆記本，否則改變狀態為已選
    const onDelete = e => {
        e.preventDefault();
        if(currentDeleteNotebook === _id) {
            setStatus(null);
            deleteNotebook(_id);
        }
        else{
            setStatus('danger');
            enableDeleteNotebook(_id);
        }
    }

    const onChange = e => {
        e.preventDefault();
        setNotebook({...notebook, [e.target.name]:e.target.value});
    }

    return (
        <div className={`notebook ${status}-alert`}>
            { editNotebookVisible ? 
                (<Button outline color="primary" onClick={onEdit}>完成編輯</Button>) : 
                (<Button outline color="primary" onClick={onEdit}>編輯</Button>) }
            {!deleteNotebookVisible && (<Button outline color="primary" onClick={onDelete}>刪除</Button>)}
            <Card onClick={e => {
                e.target.name !== 'title' && e.target.name !== 'desc' && e.target.type !== 'button' && loadNote()
            }}>
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
                        </Fragment>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Notebook;