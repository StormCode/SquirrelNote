import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Pencil, Trash, Check, X } from "phosphor-react";
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import EDToolPanel from '../general/EDToolPanel';
import Models from '../general/Models';
import {
    enableEditNotebook,
    disableEditNotebook,
    enableDeleteNotebook,
    disableDeleteNotebook
} from '../../actions/notebookActions';

// Import Style
import { theme } from '../../style/themes';
import NotebookContainer from '../../style/components/Notebook';
import deleteStyle from '../../style/model/delete';

const { orange, gray } = theme;

const ToolPanelContainerBaseStyle = `
      position: absolute;
      top: 1.5rem;
      right: 0;
`;

const ToolPanelContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                display: block;
            `
        }, {
            constraint: 'min',
            width: '1280px',
            rules: `
                display: ${props.visible ? 'block' : 'none'};
            `
        }
    ]);
}

const ToolPanelContainer = styled.div`
    ${ToolPanelContainerBaseStyle}
    ${props => ToolPanelContainerResponsiveStyle(props)}
`;

const Notebook = ({
    notebook: notebookProps,
    currentEditNotebook,
    currentDeleteNotebook,
    enableEditNotebook,
    disableEditNotebook,
    enableDeleteNotebook,
    disableDeleteNotebook,
    ...props
}) => {

    const [notebook, setNotebook] = useState({
        ...notebookProps
    });

    const { _id, title, desc } = notebook;

    useEffect(() => {
        //依目前編輯的狀態切換是否顯示編輯
        currentEditNotebook === _id ? setEditNotebookVisible(true) : setEditNotebookVisible(false);

        //依目前刪除的狀態切換是否顯示刪除
        currentDeleteNotebook === _id ? setDeleteNotebookVisible(true) : setDeleteNotebookVisible(false);
    },[currentEditNotebook, currentDeleteNotebook, _id]);

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
            setColor({...defaultColor, 'confirm': orange});
        },
        'cancel': () => {
            setColor({...defaultColor, 'cancel': orange});
        },
        'edit': () => { 
            setColor({...defaultColor, 'edit': orange});
        },
        'delete': () => {
            setColor({...defaultColor, 'delete': orange});
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
            && (title !== notebookProps.title 
            || desc !== notebookProps.desc)) {
                props.updateNotebook(_id, notebook);
        }

        disableEditNotebook();
        props.setToolPanel(null);
    }

    //對已選刪除的筆記本執行刪除
    const onDelete = () => {
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotebook === _id){
            props.deleteNotebook(_id);
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
            //設定目前正在使用的ToolPanel
            props.setToolPanel(_id);
        } else if(operator === 'delete') {
            enableDeleteNotebook(_id);
            setVisible(false);
        }
    }

    const onCancelEdit = () => {
        currentEditNotebook === _id && disableEditNotebook();

        //設回原本筆記本內容
        setNotebook({...notebook,
            'title': notebookProps.title,
            'desc': notebookProps.desc
        });

        //取消目前正在使用的ToolPanel
        props.setToolPanel(null);
    }

    const onCancelDelete = () => {
        if(currentDeleteNotebook === _id) {
            disableDeleteNotebook();
            setVisible(true);
        }
    }

    const toggleDeleteOpen = () => {
        deleteNotebookVisible ? disableDeleteNotebook() : enableDeleteNotebook();
    }

    const BtnContent = ({onChange, children, tooltip}) => {
        return <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}
                data-tip data-for={tooltip}>
                    {children}
                </span>};
    
    return (
        <NotebookContainer className={[deleteNotebookVisible ? 'danger-alert' : null,'notebook'].join(' ').replace(/^[\s]/,'')}>
            <Card
                onMouseEnter={cardHoverOn}
                onMouseLeave={cardHoverOff}>
                <ToolPanelContainer visible={visible}>
                    <EDToolPanel 
                        isEnter={props.toolPanel === _id}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onEnter={onEnter}
                        onCancel={onCancelEdit}>
                        <EDToolPanel.ConfirmBtn>
                            <BtnContent onChange={iconChange.confirm} children={<Check size={22} color={color.confirm} />} />
                        </EDToolPanel.ConfirmBtn>
                        <EDToolPanel.CancelBtn>
                            <BtnContent onChange={iconChange.cancel} children={<X size={22} color={color.cancel} />} />
                        </EDToolPanel.CancelBtn>
                        <EDToolPanel.EditBtn>
                            <BtnContent onChange={iconChange.edit} children={<Pencil size={22} color={color.edit} />} />
                        </EDToolPanel.EditBtn>
                        <EDToolPanel.DeleteBtn>
                            <BtnContent onChange={iconChange.delete} children={<Trash size={22} color={color.delete} />} />
                        </EDToolPanel.DeleteBtn>
                    </EDToolPanel>
                </ToolPanelContainer>
                <CardBody onClick={props.toolPanel !== _id ? LoadNotebook : null}>
                    <CardTitle>
                        {editNotebookVisible ? 
                            <input type='text' 
                                className='form-control' 
                                name='title' 
                                placeholder='名稱' 
                                value={title} 
                                onChange={onChange} />
                            
                        : <p>{notebookProps.title}</p>}
                    </CardTitle>
                    <CardText>
                        {editNotebookVisible ? 
                            <textarea className='form-control' 
                                rows={3} 
                                name='desc' 
                                placeholder='描述' 
                                value={desc} 
                                onChange={onChange} />
                        : notebookProps.desc}
                    </CardText>
                    <Models
                        isOpen={deleteNotebookVisible}
                        toggleOpen={toggleDeleteOpen}
                        onConfirm={onDelete}
                        onCancel={onCancelDelete}
                        modelStyle={deleteStyle}>
                        <Models.Content>
                            <p>筆記本將會移動至回收站，確定刪除嗎？</p>
                        </Models.Content>
                        <Models.ConfirmBtn enable={true}>刪除</Models.ConfirmBtn>
                        <Models.CancelBtn>取消</Models.CancelBtn>
                    </Models>
                </CardBody>
            </Card>
        </NotebookContainer>
    )
}

Notebook.propTypes = { 
    currentEditNotebook: PropTypes.string,
    currentDeleteNotebook: PropTypes.string,
    enableEditNotebook: PropTypes.func.isRequired,
    disableEditNotebook: PropTypes.func.isRequired,
    enableDeleteNotebook: PropTypes.func.isRequired,
    disableDeleteNotebook: PropTypes.func.isRequired
};

const mapStateProps = state => ({
    currentEditNotebook: state.notebooks.currentEditNotebook,
    currentDeleteNotebook: state.notebooks.currentDeleteNotebook
});

export default connect(
    mapStateProps,
    {
        enableEditNotebook,
        disableEditNotebook,
        enableDeleteNotebook,
        disableDeleteNotebook
    }
)(Notebook);