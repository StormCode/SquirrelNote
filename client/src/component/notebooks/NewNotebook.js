import React, { Fragment, useState, useContext, useEffect } from 'react'
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

const NewNotebook = ({visible}) => {
    const notebookContext = useContext(NotebookContext);

    const { 
        disableAddNotebook, 
        addNotebook 
    } = notebookContext;

    const [notebook, setNotebook] = useState({
        title: '',
        desc: ''
    });

    const { title, desc } = notebook;

    const defaultColor = {
        confirm: gray,
        cancel: gray
    };

    const [color, setColor] = useState(defaultColor);

    useEffect(() => {
        setColor(defaultColor);
        setNotebook({
            title: '',
            desc: ''
        });

        // eslint-disable-next-line
    }, []);

    const onChange = e => setNotebook({
        ...notebook, [e.target.name]: e.target.value
    });

    const onAddNotebook = e => {
        e.preventDefault();
        addNotebook(notebook);
        //清除筆記本內容
        setNotebook({
            title: '',
            desc: ''
        });
        //恢復預設顏色
        setColor(defaultColor);
    };

    const onDisableAddNotebook = e => {
        e.preventDefault();
        //清除筆記本內容
        setNotebook({
            title: '',
            desc: ''
        });
        //恢復預設顏色
        setColor(defaultColor);
        disableAddNotebook();
    };

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, ['confirm']: orange});
        },
        'cancel': () => {
            setColor({...defaultColor, ['cancel']: orange});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const BtnContent = ({onChange, children}) => {
        return <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                    {children}
                </span>};

    return (
        <Fragment>
            {visible ? (<NotebookContainer className='notebook'>
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
                            onCancel={onDisableAddNotebook}>
                            <ToolPanel.ConfirmBtn>
                                <BtnContent onChange={iconChange.confirm} children={<Check size={20} color={color.confirm} weight='bold' />} />
                            </ToolPanel.ConfirmBtn>
                            <ToolPanel.CancelBtn>
                                <BtnContent onChange={iconChange.cancel} children={<X size={20} color={color.cancel} weight='bold' />} />
                            </ToolPanel.CancelBtn>
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