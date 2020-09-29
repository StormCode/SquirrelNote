import React, { Fragment, useState, useContext } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
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

    return (
        <Fragment>
            {addNotebookVisible ? (<div className='notebook'>
                <Card>
                    {/* todo: 加入封面 */}
                    {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap" /> */}
                    <CardBody>
                        <CardTitle>
                            <input type='text' className='form-control' name='title' placeholder='名稱' value={title} onChange={onChange} />
                        </CardTitle>
                        <CardText>
                            <textarea className='form-control' rows={3} name='desc' placeholder='描述' value={desc} onChange={onChange} />
                        </CardText>
                        <Button outline color="primary" onClick={e => {
                            e.preventDefault();
                            addNotebook(notebook);
                        }}>新增</Button>
                        <Button outline color="primary" onClick={e => {
                            e.preventDefault();
                            disableAddNotebook();
                        }}>取消</Button>
                    </CardBody>
                </Card>
            </div>) : null}
        </Fragment>
    )
}

export default NewNotebook;

//todo: 當焦點離開新增的區域時自動隱藏