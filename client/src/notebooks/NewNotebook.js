import React, { Fragment, useState, useContext } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, UncontrolledTooltip
  } from 'reactstrap';

// Import Style
import '../style/components/Notebook.css';

// Import Resource
import confirmImg from '../assets/general/confirm_32x32.png';
import cancelImg from '../assets/general/close_32x32.png';

import NotebookContext from '../context/notebooks/notebookContext';

const NewNotebook = () => {
    const notebookContext = useContext(NotebookContext);

    const { addNotebookVisible, disableAddNotebook, addNotebook } = notebookContext;

    const [notebook, setNotebook] = useState({
        title: '',
        desc: ''
    });

    const { title, desc } = notebook;

    const onChange = e => setNotebook({
        ...notebook, [e.target.name]: e.target.value
    });

    const onAddNotebook = e => {
        e.preventDefault();
        addNotebook(notebook);
    };

    const onDisableAddNotebook = e => {
        e.preventDefault();
        //清除筆記本內容
        setNotebook({
            title: '',
            desc: ''
        });
        disableAddNotebook();
    };

    return (
        <Fragment>
            {addNotebookVisible ? (<div className='notebook'>
                <Card>
                    <div className='tool-panel'>
                        <button id='add-confirm-btn' onClick={onAddNotebook}>
                            <img src={confirmImg} alt='新增' />
                        </button>
                        <button id='cancel-btn' onClick={onDisableAddNotebook}>
                            <img src={cancelImg} alt='取消' />
                        </button>
                        <UncontrolledTooltip placement="bottom" target="add-confirm-btn">
                            確定新增
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="bottom" target="cancel-btn">
                            取消
                        </UncontrolledTooltip>
                    </div>
                    {/* todo: 加入封面 */}
                    {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
                    <CardBody>
                        <CardTitle>
                            <input type='text' className='form-control' name='title' placeholder='名稱' value={title} onChange={onChange} />
                        </CardTitle>
                        <CardText>
                            <textarea className='form-control' rows={3} name='desc' placeholder='描述' value={desc} onChange={onChange} />
                        </CardText>
                    </CardBody>
                </Card>
            </div>) : null}
        </Fragment>
    )
}

export default NewNotebook;

//todo: 當焦點離開新增的區域時自動隱藏