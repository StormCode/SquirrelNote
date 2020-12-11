import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CheckSquareOffset } from "phosphor-react";
import AuthModels from '../auth/AuthModels';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Resource
import BackgroundImage from '../../assets/index/background_icons.png';
import SquirrelWithPenImage from '../../assets/index/squirrel_with_pen_image.png';
import PaperImage from '../../assets/index/paper.png';
import PaperAirPlaneSmaillImage from '../../assets/index/paper_airplane_300w.png';
import PaperAirPlaneMediumImage from '../../assets/index/paper_airplane_1000w.png';
import FrogSmallImage from '../../assets/index/frog_300w.png';
import FrogMediumImage from '../../assets/index/frog_1000w.png';
import NoteImage from '../../assets/index/note.png';
import WYSIWYGImage from '../../assets/index/WYSIWYG.png';
import RichEditFunctionImage from '../../assets/index/rich_edit_function.png';
import AutosaveImage from '../../assets/index/autosave.png';
import SecureImage from '../../assets/index/secure.png';

import AuthContext from '../../context/auth/authContext';

import { REGISTER } from '../../modelTypes';

const ContainerBaseStyle = theme => {
    return `
        @keyframes slidein {
            to {
                bottom: 70%;
                color: rgba(0, 0, 0, 1);
            }
        }

        background: url(${BackgroundImage}) #D4D4D4 fixed;
        width: 100%;

        .banner {
            position: relative;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh;
        }

        .banner-header {
            font-size: 1.5rem;
            margin-bottom: .5rem;
            position: absolute;
            bottom: 50%;
            color: rgba(0, 0, 0, 0);

            animation-name: slidein;
            animation-duration: 1s;
            animation-fill-mode: forwards;
        }

        .start-btn {
            background: linear-gradient(${theme.orange}, ${theme.darkOrange});
            position: relative;
            border: none;
            border-radius: 10px;
            color: #FFF;
            font-size: 2rem;
            font-weight: 300;
            padding: 1rem 1.5rem;
            box-shadow: 5px 8px 5px rgba(0,0,0,.6);
        
            &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 10px 10px 0 0;
                background: linear-gradient(rgba(255, 255, 255, .75), rgba(255, 255, 255, .1));
                width: 100%;
                height: 50%;
            }
        
            &:hover {
                background: ${theme.orange};
                font-weight: 500;
            }
        
            &:hover:after {
                background: linear-gradient(${theme.lightOrange}, rgba(255, 255, 255, .1));
            }
        }

        .bg-second-layer {
            background: url(${PaperImage}) right center/cover no-repeat local;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .paper-airplane {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 25%;
            transform: rotate(15deg) translate(15%, 0%);
        }

        .frog {
            position: absolute;
            top: 0;
            right: 0;
            width: 15%;
            transform: translate(-15%, 15%);
        }

        .feature-container {
            background: rgb(0,0,0);
            background: linear-gradient(
                0deg, rgba(0,0,0,1) 0%, 
                rgba(9,6,111,1) 50%, 
                rgba(0,0,0,1) 100%);
            display: flex;
            flex-flow: row wrap;
            width: 100%;
        }

            .feature-container > div {
                min-height: 400px;
            }
            
            .feature-container > div:not(.desc-block) {
                background: rgba(255, 255, 255, .5);
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
            }

            .feature-container > div.desc-block {
                background: rgba(0, 0, 0, .6) padding-box;
            }

                .feature-container > div > .desc {
                    font-size: 1.2rem;
                    line-height: 2rem;
                    color: ${theme.gray};
                }

                .feature-container > div > .title {
                    font-size: 1.8rem;
                    font-weight: bold;
                    line-height: 5rem;
                    color: #FFF;
                }

                .feature-container > div > .tip {
                    margin-top: 1rem;
                    font-size: .5rem;
                    text-align: right;
                    color: ${theme.gray};
                }

                .feature-container > div > img {
                    max-width: 100%;
                    max-height: 100%;
                }

        .intro-container {
            position: relative;
            display: flex;
            align-items: flex-end;
        }

            .intro-container > ul {
                background: url(${NoteImage}) left center/cover no-repeat local padding-box;
                position: relative;
                text-align: center;
            }

                .intro-container > ul > li {
                    font-size: 1.5rem;
                    line-height: 5rem;
                    text-decoration: underline;
                    white-space: nowrap;
                    color: ${theme.blue};
                }

                .intro-container > .front-img {
                    max-height: 100%;
                    z-index: 1;
                }

        .mask {
            background: rgba(255, 255, 255, .5);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `
};

const ContainerResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .feature-container {
                    padding: 3.5rem;
                }
                
                    .feature-container > div {
                        flex: 1 1 100%;
                        padding: 3.5rem;
                    }

                    .feature-container > div:nth-of-type(1) {
                        order: 1;
                    }

                    .feature-container > div:nth-of-type(2) {
                        order: 2;
                    }

                    .feature-container > div:nth-of-type(3) {
                        order: 4;
                    }

                    .feature-container > div:nth-of-type(4) {
                        order: 3;
                    }

                    .feature-container > div:nth-of-type(5) {
                        order: 5;
                    }

                    .feature-container > div:nth-of-type(6) {
                        order: 6;
                    }

                    .feature-container > div:nth-of-type(7) {
                        order: 8;
                    }

                    .feature-container > div:nth-of-type(8) {
                        order: 7;
                    }

                .intro-container {
                    flex-flow: row wrap;
                }

                    .intro-container > .front-img {
                        flex: 1 1 100%;
                        max-width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: -10%;
                    }

                    .intro-container > ul {
                        flex: 1 1 100%;
                        padding: 5rem 5rem 10rem 0;
                    }

                    .intro-container > ul > li {
                        text-align: right;
                    }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: ` 
                .feature-container {
                    padding: 3.5rem 10rem;
                }

                    .feature-container > div {
                        padding: 8rem;
                    }

                .intro-container > ul {
                    padding: 5rem 5rem 15rem 0;
                }
            `
        }, {
            constraint: 'min',
            width: '1280px',
            rules: `
                .feature-container {
                    padding: 3.5rem;
                }
                    .feature-container > div {
                        flex: 1 1 50%;
                        padding: 6rem;
                    }

                    .feature-container > div:nth-of-type(1) {
                        order: 1;
                    }

                    .feature-container > div:nth-of-type(2) {
                        order: 2;
                    }

                    .feature-container > div:nth-of-type(3) {
                        order: 3;
                    }

                    .feature-container > div:nth-of-type(4) {
                        order: 4;
                    }

                    .feature-container > div:nth-of-type(5) {
                        order: 5;
                    }

                    .feature-container > div:nth-of-type(6) {
                        order: 6;
                    }

                    .feature-container > div:nth-of-type(7) {
                        order: 7;
                    }

                    .feature-container > div:nth-of-type(8) {
                        order: 8;
                    }
                
                .intro-container {
                    flex-flow: row nowrap;
                }

                    .intro-container > .front-img {
                        flex: 1 1 50%;
                        position: relative;
                        left: -5%;
                        max-width: 60vw;
                        max-height: 100%;
                    }

                    .intro-container > ul {
                        flex: 1 1 auto;
                        padding: 5rem;
                    }

                    .intro-container > ul > li {
                        text-align: center;
                    }
            `
        }
    ])
}

const Container = styled.div`
    ${({theme}) => ContainerBaseStyle(theme)}
    ${ContainerResponsiveStyle()}
`;

const Index = () => {
    const history = useHistory();
    const authContext = useContext(AuthContext);

    const {
        isAuthenticated,
        loadUser
    } = authContext;

    useEffect(() => {
        localStorage.getItem('token') !== null && loadUser();

        // eslint-disable-next-line
    }, []);

    const [modelOpen, setModelOpen] = useState(false);
    const [model, setModel] = useState(null);

    const toggleOpen = () => setModelOpen(!modelOpen);
    const toggleModel = model => setModel(model);
    const openRegister = () => {
        toggleOpen();
        toggleModel(REGISTER);
    }

    const loadEntry = e => {
        e.preventDefault();
        isAuthenticated ? history.push('/notebook') : openRegister();
    }

    return (
        <Container>
            <div className='banner'>
                <div className='bg-second-layer'></div>
                <div className='mask'></div>
                <img src={PaperAirPlaneSmaillImage} 
                    srcSet={`
                        ${PaperAirPlaneSmaillImage} 300w, 
                        ${PaperAirPlaneMediumImage} 1000w
                    `} 
                    className='paper-airplane' />
                <img src={FrogSmallImage} 
                    srcSet={`
                        ${FrogSmallImage} 300w, 
                        ${FrogMediumImage} 1000w
                    `}
                    className='frog' />
                <p className='banner-header'>輕量級筆記應用</p>
                <button className='start-btn' onClick={loadEntry}>開始使用</button>
            </div>
            <div className='feature-container'>
                <div><img src={WYSIWYGImage} /></div>
                <div className='desc-block'>
                    <p className='title'>所見即所得</p>
                    <p className='desc'>What You See Is What You Get，縮寫WYSIWYG</p>
                    <p className='desc'>您在編輯器所見的畫面與儲存後呈現的畫面一致，不需要擔心筆記格式跑掉。</p>
                </div>
                <div className='desc-block'>
                    <p className='title'>豐富的文字編輯功能</p>
                    <p className='desc'>您可以自由的調整想要的文字樣式、段落格式、編號...</p>
                    <p className='desc'>也可以上傳圖片、插入表格</p>
                </div>
                <div><img src={RichEditFunctionImage} /></div>
                <div><img src={AutosaveImage} /></div>
                <div className='desc-block'>
                    <p className='title'>自動儲存</p>
                    <p className='desc'>筆記編輯模式下每隔一段時間即自動儲存至後台資料庫</p>
                    <p className='tip'>(自動儲存間隔時間：5分鐘)</p>
                </div>
                <div className='desc-block'>
                    <p className='title'>隱私安全</p>
                    <p className='desc'>您所撰寫的任何內容全部加密儲存，安全的存放在後台資料庫</p>
                </div>
                <div><img src={SecureImage} /></div>
            </div>   
            <div className='intro-container'>
                <div className='mask'></div>
                <img className='front-img' src={SquirrelWithPenImage}></img>
                <ul>
                    <li><CheckSquareOffset size={48} />整理你的思緒</li>
                    <li><CheckSquareOffset size={48} />記錄珍貴回憶</li>
                    <li><CheckSquareOffset size={48} />學習更有效率</li>
                </ul>
            </div>
            <AuthModels
                model={model}
                isOpen={modelOpen}
                toggleModel={toggleModel}
                toggleOpen={toggleOpen}>
                <AuthModels.Login>登入</AuthModels.Login>
                <AuthModels.Register>註冊</AuthModels.Register>
                <AuthModels.ForgotPassword>忘記密碼</AuthModels.ForgotPassword>
            </AuthModels>
        </Container>
    )
}

export default Index;