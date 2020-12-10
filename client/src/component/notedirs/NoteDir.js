import React, { Fragment, useCallback, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, Trash, Check, X } from "phosphor-react";
import EDToolPanel from '../layout/EDToolPanel';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import Models from '../layout/Models';

// Import Style
import { theme } from '../../style/themes';
import deleteStyle from '../../style/model/delete';
import NoteDirContainer from '../../style/components/Notedir';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

const { orange, darkOrange, gray } = theme;
const currentFontColor = '#FFF';

// const NoteDirContainer = styled.li`
//     cursor: pointer;
//     background: ${props => props.isCurrent ? orange : 'none'};
//     color: ${props => props.isCurrent ? '#FFF' : gray};
//     padding: .5rem 0 .5rem .5rem;
//     font-size: 1rem;
//     height: auto;
//     &:hover {
//         background: ${props => props.isCurrent ? darkOrange : 'none'};
//         color: ${props => props.isCurrent ? '#FFF' : orange};
//     };

//         .text-container,
//         .toolpanel-container {
//             position: relative;
//         }

//         .text-container {
//             width: 20ch;
//             max-width: 100%;
//         }

//             .text-container p {
//                 white-space: nowrap;
//                 text-overflow: ellipsis;
//                 overflow: hidden;
//             }

//         .toolpanel-container {
//             width: 100%;
//             z-index: 1;
//         }
// `;

const Input = styled.input`
    background: none;
    border: none;
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const ToolPanelContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '320px',
            rules: `
                display: block;
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                display: ${props.visible ? 'block' : 'none'};
            `
        }
    ]);
}

const ToolPanelContainer = styled.div`
    ${props => ToolPanelContainerResponsiveStyle(props)}
`;

const Notedir = props => {
    const [notedir, setNotedir] = useState({
        ...props.notedir
    });
    
    const { _id, title } = notedir;
    const [editNotedirVisible, setEditNotedirVisible] = useState(false);
    const [deleteNotedirVisible, setDeleteNotedirVisible] = useState(false);

    //ToolPanel的可見狀態
    const [visible, setVisible] = useState(false);
    
    const defaultColor = {
        edit: gray,
        delete: gray,
        confirm: gray,
        cancel: gray
    };

    const [color, setColor] = useState(defaultColor);

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
        deleteNotedir
    } = notedirContext;

    useEffect(() => {
        return () =>　{
            setColor(defaultColor);
        }

        // eslint-disable-next-line
    },[]);


    useEffect(() => {
        //依目前編輯的狀態切換是否顯示編輯
        currentEditNotedir === _id ? setEditNotedirVisible(true) : setEditNotedirVisible(false);

        //依目前刪除的狀態切換是否顯示刪除
        currentDeleteNotedir === _id ? setDeleteNotedirVisible(true) : setDeleteNotedirVisible(false);
    },[currentEditNotedir, currentDeleteNotedir]);
    
    const notedirTextRef = useCallback(inputElement => {
        if (inputElement) {
          inputElement.focus();
        }
      }, []);

    const onChange = e => {
        e.preventDefault();
        setNotedir({...notedir, ['title']:e.target.value});
    }

    const onClick = e => {
        e.preventDefault();
        props.setCurrent(_id);
    }

    const onEdit = () => {
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
            updateNotedir(_id, notedirUpdateData);
        }

        disableEditNotedir();
        props.setToolPanel(null);
    };

    const onDelete = () => {
        //對點擊刪除的那一個筆記本執行delete
        if(currentDeleteNotedir === _id){
            deleteNotedir(_id, currentNotebookId);
        }

        disableDeleteNotedir();
        props.setToolPanel(null);
    };
    
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
            setColor({...defaultColor, ['confirm']: currentNotedirId === _id ? currentFontColor : orange});
        },
        'cancel': () => {
            setColor({...defaultColor, ['cancel']: currentNotedirId === _id ? currentFontColor : orange});
        },
        'edit': () => { 
            setColor({...defaultColor, ['edit']: currentNotedirId === _id ? currentFontColor : orange});
        },
        'delete': () => {
            setColor({...defaultColor, ['delete']: currentNotedirId === _id ? currentFontColor : orange});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const onEnter = (operator) => {
        if(operator === 'edit') {
            enableEditNotedir(_id);
            //設定目前正在使用的ToolPanel
            props.setToolPanel(_id);
        } else if(operator === 'delete') {
            enableDeleteNotedir(_id);
        }
    }

    const onCancelEdit = () => {
        disableEditNotedir();

        //設回原本筆記目錄內容
        setNotedir({...props.notedir, ['title']: props.notedir.title});

        //取消目前正在使用的ToolPanel
        props.setToolPanel(null);
    }

    const onCancelDelete = () => {
        disableDeleteNotedir();
    }

    const toggleDeleteOpen = () => {
        deleteNotedirVisible ? disableDeleteNotedir() : enableDeleteNotedir();
    }

    const BtnContent = ({onChange, children}) => {
        return <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                    {children}
                </span>};

    return (
        <NoteDirContainer
            isCurrent = {currentNotedirId === _id}
            onMouseEnter={cardHoverOn}
            onMouseLeave={cardHoverOff}>
            { notedir !== null ?
            <Fragment>
                <div className='toolpanel-container'>
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
                </div>
                <div className='text-container'
                    onClick={onClick}>
                    {editNotedirVisible && 
                        (<Input type='text'
                            value={title}
                            ref={notedirTextRef}
                            placeholder='請輸入資料夾名稱'
                            onChange={onChange} />)
                    || (<p>{props.notedir.title}</p>)}
                </div>
                <Models
                    isOpen={deleteNotedirVisible}
                    toggleOpen={toggleDeleteOpen}
                    onConfirm={onDelete}
                    onCancel={onCancelDelete}
                    modelStyle={deleteStyle}>
                    <Models.Content>
                        <p>筆記目錄將會移動至回收站，確定刪除嗎？</p>
                    </Models.Content>
                    <Models.ConfirmBtn enable={true}>刪除</Models.ConfirmBtn>
                    <Models.CancelBtn>取消</Models.CancelBtn>
                </Models>
            </Fragment>
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