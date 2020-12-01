import React, { Fragment, useState, useContext } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, UncontrolledTooltip
} from 'reactstrap';
import { Check, X } from "phosphor-react";
import ToolPanel from '../layout/ToolPanel';

// Import Style
import { theme } from '../../style/themes';
import NotebookContainer from '../../style/components/Notebook';

import NotebookContext from '../../context/notebooks/notebookContext';

const { orange, gray } = theme;

const NewNotebook = () => {
    const notebookContext = useContext(NotebookContext);

    const { 
        addNotebookVisible, 
        disableAddNotebook, 
        addNotebook 
    } = notebookContext;

    const [notebook, setNotebook] = useState({
        title: '',
        desc: ''
    });

    const { title, desc } = notebook;

    const [color, setColor] = useState({
        confirm: gray,
        cancel: gray
    });

    const onChange = e => setNotebook({
        ...notebook, [e.target.name]: e.target.value
    });

    //滑鼠移過icon時改變顏色
    const iconHoverOn = e => {
        e.preventDefault();
        setColor({...color, [e.target.name]: orange});
    }

    //滑鼠移出icon時恢復顏色
    const iconHoverOff = e => {
        e.preventDefault();
        setColor({...color, [e.target.name]: gray});
    }

    const onAddNotebook = e => {
        e.preventDefault();
        addNotebook(notebook);
        //清除筆記本內容
        setNotebook({
            title: '',
            desc: ''
        });
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
            {addNotebookVisible ? (<NotebookContainer className='notebook'>
                <Card>
                    {/* <div className='tool-panel'> */}
                        {/* <button id='add-confirm-btn' onClick={onAddNotebook}>
                            <img src={confirmImg} alt='新增' />
                        </button>
                        <button id='cancel-btn' onClick={onDisableAddNotebook}>
                            <img src={cancelImg} alt='取消' />
                        </button> */}
                        <ToolPanel 
                            onConfirm={onAddNotebook}
                            onCancel={onDisableAddNotebook}
                            hoverOn={iconHoverOn}
                            hoverOff={iconHoverOff}>
                            <ToolPanel.ConfirmBtn><Check size={20} color={color.confirm} weight='bold' /></ToolPanel.ConfirmBtn>
                            <ToolPanel.CancelBtn><X size={20} color={color.cancel} weight='bold' /></ToolPanel.CancelBtn>
                        </ToolPanel>
                        {/* <UncontrolledTooltip placement="bottom" target="add-confirm-btn">
                            確定新增
                        </UncontrolledTooltip>
                        <UncontrolledTooltip placement="bottom" target="cancel-btn">
                            取消
                        </UncontrolledTooltip> */}
                    {/* </div> */}
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
            </NotebookContainer>) : null}
        </Fragment>
    )
}

export default NewNotebook;

//todo: 當焦點離開新增的區域時自動隱藏