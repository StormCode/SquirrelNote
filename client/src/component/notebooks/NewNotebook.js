import React, { Fragment, useState, useContext, useEffect } from 'react'
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Check, X } from "phosphor-react";
import ToolPanel from '../general/ToolPanel';

// Import Style
import { theme } from '../../style/themes';
import NotebookContainer from '../../style/components/Notebook';

import NotebookContext from '../../context/notebooks/notebookContext';

const { orange, gray } = theme;

const NewNotebook = ({visible, addNotebook}) => {
    const notebookContext = useContext(NotebookContext);

    const { 
        disableAddNotebook, 
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

    useEffect(() => {
        window.addEventListener("beforeunload", onClose);

        return () => {
            window.removeEventListener("beforeunload", onClose);
        }

        // eslint-disable-next-line
    }, [visible]);

    // 視窗關閉前確認是否有未儲存的暫存筆記本
    const onClose = e => {
        if(visible) {
            e.preventDefault();
            e.returnValue = '';
        }
    
        return null;
    }

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
            setColor({...defaultColor, 'confirm': orange});
        },
        'cancel': () => {
            setColor({...defaultColor, 'cancel': orange});
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