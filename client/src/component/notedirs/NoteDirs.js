import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Check, X, FolderSimplePlus, ArrowLineLeft } from "phosphor-react";
import Tooltip from "@material-ui/core/Tooltip";
import TextInput from '../general/TextInput';
import NotedirSorter from './NotedirSorter';
import Notedir from './NoteDir';
import AllNotedir from './AllNotedir';
import makeResponsiveCSS from '../../utils/make-responsive-css';

// Import Resource
import NotedirSmallImage from '../../assets/note/notedir_300w.png';
import NotedirMediumImage from '../../assets/note/notedir_1000w.png';
import NotedirLargeImage from '../../assets/note/notedir_2000w.png';

// Import Style
import { theme } from '../../style/themes';
import IntroBox from '../../style/general/IntroBox';

import { 
    getNotedirs, 
    clearNotedir,
    setCurrentNotedir, 
    enableAddNotedir,
    disableAddNotedir,
    addNotedir
} from '../../actions/notedirActions';
import { setAlert } from '../../actions/alertActions';

const { orange, gray } = theme;

const NotedirListBaseStyle = theme => {
    return `
        flex: 1 1 100%;
        display: flex;
        flex-flow: column nowrap;
        padding: .5rem;

            > .notedir-header {
                display: flex;
                flex-flow: row nowrap;
                border-bottom: 1px solid ${theme.orange};
                padding: .3rem;
                align-items: center;
                min-height: 2.5rem;
        
                    > .title {
                        color: ${theme.gray};
                        font-size: 1rem;
                        font-weight: bold;
                    }
                    
                    > button {
                        flex: 0 1 auto;
                        position: relative;
                        background: none;
                        border: none;
                    }
                
                    > button:first-of-type {
                        margin-left: auto;
                    }
            }

            ul {
                flex: 1 1 auto;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 0;
                overflow-y: visible;
            }

            .parlgrm {
                background: ${theme.orange};
                display: inline-block;
                min-width: .5rem;
                height: 1rem;
                margin-right: .5rem;
                transform: skew(-30deg);
            }
    `;
}

const NotedirListResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `                
                .collapse-btn {
                    display: none;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .collapse-btn {
                    display: block;
                }
            `
        }
    ])
}


const NotedirList = styled.div`
    ${({theme}) => NotedirListBaseStyle(theme)}
    ${NotedirListResponsiveStyle()}
`;

const Notedirs = ({ 
    notebookId, 
    toggleCollapse,
    notedirs, 
    current,
    addNotedirVisible, 
    loading,
    success,
    error,
    getNotedirs, 
    clearNotedir,
    setCurrentNotedir, 
    enableAddNotedir,
    disableAddNotedir,
    addNotedir, 
    setAlert 
}) => {
    
    useEffect(() => {
        getNotedirs(notebookId);

        return () => {
            clearNotedir();
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // 筆記目錄設定為全部
        if(notedirs && !current) setCurrentNotedir('');

        // eslint-disable-next-line
    }, [notedirs, current]);

    useEffect(() => {
        current ? setCurrentNotedir(current._id) : setCurrentNotedir('');

        // eslint-disable-next-line
    }, [current]);

    useEffect(() => {
        success && setAlert(success, 'success');

        // eslint-disable-next-line
    }, [success]);

    useEffect(() => {
        error && setAlert(error, 'danger');

        // eslint-disable-next-line
    }, [error]);
    
    const defaultColor = {
        confirm: gray,
        cancel: gray,
        notedir: gray,
        collapse: gray
    };
    
    const [color, setColor] = useState(defaultColor);

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, 'confirm': orange});
        },
        'cancel': () => {
            setColor({...defaultColor, 'cancel': orange});
        },
        'notedir': () => {
            setColor({...defaultColor, 'notedir': orange});
        },
        'collapse': () => {
            setColor({...defaultColor, 'collapse': orange});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const BtnContent = ({onChange, children, tooltip}) => {
        return <Tooltip
            title={tooltip}
            placement='top'
        >
            <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                {children}
            </span>
        </Tooltip>};
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    const setCurrent = id => {
        setCurrentNotedir(id);
    }

    const onAddNotedir = title => {
        let notedir = {
            title,
            notebook: notebookId
        };

        addNotedir(notedir);
        disableAddNotedir();
    }

    const onCancel = () => {
        disableAddNotedir();
    }

    const onEnableAddNotedir = e => {
        e.preventDefault();
        enableAddNotedir();
    }

    const onToggleCollapse = e => {
        e.preventDefault();
        toggleCollapse();
    }

    return (
        <Fragment>
            { !loading &&
                notedirs && !error && (<NotedirList className='notedir-list'>
                    <div className='notedir-header'>
                        <i className='parlgrm'></i>
                        <span className='title'>目錄</span>
                        <button alt='add notedir' className='tiny-btn' onClick={onEnableAddNotedir}>
                            <BtnContent onChange={iconChange.notedir} children={<FolderSimplePlus size={22} color={color.notedir} />} tooltip='新增目錄' />
                        </button>
                        <NotedirSorter />
                        <button alt='collapse/expand notedir' className='tiny-btn collapse-btn' onClick={onToggleCollapse}>
                            <BtnContent onChange={iconChange.collapse} children={<ArrowLineLeft size={22} color={color.collapse} />} tooltip='隱藏清單' />
                        </button>
                    </div>
                    { notedirs.length >= 1 ?
                        <Fragment>
                            <ul>
                                <AllNotedir setCurrent={setCurrent} />
                                <TextInput  
                                    visible={addNotedirVisible}
                                    placeholder={'請輸入筆記目錄名稱'}
                                    onConfirm={onAddNotedir}
                                    onCancel={onCancel}>
                                    <TextInput.ConfirmBtn>
                                        <BtnContent onChange={iconChange.confirm} children={<Check size={22} color={color.confirm} weight='bold' />} tooltip='完成' />
                                    </TextInput.ConfirmBtn>
                                    <TextInput.CancelBtn>
                                        <BtnContent onChange={iconChange.cancel} children={<X size={22} color={color.cancel} weight='bold' />} tooltip='取消' />
                                    </TextInput.CancelBtn>
                                </TextInput>
                                {notedirs
                                    .filter(notedir => !notedir.default)
                                    .map(notedir => 
                                        <Notedir 
                                            key={notedir._id} 
                                            notebookId={notebookId}
                                            notedir={notedir} 
                                            toolPanel={currentToolPanel}
                                            setCurrent={setCurrent}
                                            setToolPanel={setToolPanel} 
                                        />
                                )}
                            </ul>
                        </Fragment>
                        : <IntroBox>
                            <img alt='notedir-bg' src={NotedirSmallImage}
                                srcSet={`
                                ${NotedirSmallImage} 300w, 
                                ${NotedirMediumImage} 1000w, 
                                ${NotedirLargeImage} 2000w
                                `} 
                            />
                            <p>建立目錄可以幫助你分類筆記</p>
                        </IntroBox>
                    }
                </NotedirList>)}
        </Fragment>
    )
}

Notedirs.propTypes = {
    notebookId: PropTypes.string.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    notedirs: PropTypes.array,
    current: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    getNotedirs: PropTypes.func.isRequired, 
    clearNotedir: PropTypes.func.isRequired,
    setCurrentNotedir: PropTypes.func.isRequired, 
    addNotedirVisible: PropTypes.bool.isRequired, 
    enableAddNotedir: PropTypes.func.isRequired,
    disableAddNotedir: PropTypes.func.isRequired,
    addNotedir: PropTypes.func.isRequired, 
    loading: PropTypes.bool.isRequired,
    success: PropTypes.string,
    error: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}

const mapStateProps = state => ({
    notedirs: state.notedirs.notedirs,
    current: state.notedirs.current,
    addNotedirVisible: state.notedirs.addNotedirVisible, 
    loading: state.notedirs.loading,
    success: state.notedirs.success,
    error: state.notedirs.error
});

export default connect(
    mapStateProps,
    { 
        getNotedirs, 
        clearNotedir,
        setCurrentNotedir, 
        enableAddNotedir,
        disableAddNotedir,
        addNotedir, 
        setAlert 
    }
)(Notedirs);