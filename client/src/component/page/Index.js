import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import AuthModels from '../auth/AuthModels';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Resource
import BackgroundImage from '../../assets/index/background_icons.png';
import SquirrelWithPenSmallImage from '../../assets/index/squirrel_with_pen_300w.png';
import SquirrelWithPenLargeImage from '../../assets/index/squirrel_with_pen_2000w.png';
import PaperImage from '../../assets/index/paper.png';
import PaperAirPlaneSmaillImage from '../../assets/index/paper_airplane_300w.png';
import PaperAirPlaneMediumImage from '../../assets/index/paper_airplane_1000w.png';
import PaperAirPlaneLargeImage from '../../assets/index/paper_airplane_2000w.png';
import PaperFrogSmallImage from '../../assets/index/paper_frog_300w.png';
import PaperFrogMediumImage from '../../assets/index/paper_frog_1000w.png';
import PaperFrogLargeImage from '../../assets/index/paper_frog_2000w.png';
import LightBulbSmallImage from '../../assets/index/lightbulb_300w.png';
import LightBulbMediumImage from '../../assets/index/lightbulb_1000w.png';
import LightBulbLargeImage from '../../assets/index/lightbulb_2000w.png';
import BrainSmallImage from '../../assets/index/brain_300w.png';
import BrainMediumImage from '../../assets/index/brain_1000w.png';
import BrainLargeImage from '../../assets/index/brain_2000w.png';
import BalloonSmallImage from '../../assets/index/balloon_300w.png';
import BalloonMediumImage from '../../assets/index/balloon_1000w.png';
import BalloonLargeImage from '../../assets/index/balloon_2000w.png';
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
                bottom: 65%;
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
            font-weight: 500;
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

        .paper-airplane,
        .frog {
            position: absolute;
        }

        .paper-airplane {
            transform: rotate(15deg);
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
                max-height: 400px;
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
            background: rgb(0,131,177);
            background: linear-gradient(151deg, 
                rgba(0,131,177,1) 0%, 
                rgba(36,117,207,1) 20%, 
                rgba(0,211,255,0.5) 20%, 
                rgba(0,211,255,0.5) 25%, 
                rgba(54,111,222,1) 25%, 
                rgba(42,115,212,1) 32%, 
                rgba(0,211,255,0.5) 32%, 
                rgba(0,211,255,0.5) 37%, 
                rgba(95,95,255,1) 37%, 
                rgba(95,78,255,1) 44%, 
                rgba(0,211,255,0.5) 44%, 
                rgba(0,211,255,0.5) 49%, 
                rgba(95,72,255,1) 49%, 
                rgba(94,0,255,1) 80%);
            position: relative;
            display: flex;
        }

            .intro-container > ul {
                background: url(${NoteImage}) left top/cover no-repeat local padding-box;
                position: relative;
                text-align: center;
                margin: 0;
            }

                .intro-container > ul > li {
                    font-size: 1.5rem;
                    font-weight: bold;
                    line-height: 5rem;
                    white-space: nowrap;
                }

                .intro-container > ul > li:nth-of-type(2n) {
                    padding-left: 5rem;
                }

                    .intro-container > ul > li > img {
                        margin-right: 1rem;
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
                .bg-second-layer {
                    background-position-x: center;
                }

                .paper-airplane {
                    bottom: 15%;
                    left: 0;
                    width: 50%;
                }
        
                .frog {
                    top: 20%;
                    right: 5%;
                    width: 20%;
                }

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
                    align-items: flex-end;
                }

                    .intro-container > .front-img {
                        flex: 1 1 100%;
                        position: absolute;
                        bottom: 0;
                        left: -10%;
                        width: 80%;
                    }

                    .intro-container > ul {
                        flex: 1 1 100%;
                        background-position-y: top;
                        padding: 10rem 5rem 10rem 0;
                    }

                    .intro-container > ul > li {
                        margin: 1rem 0;
                        text-align: right;
                    }

                        .intro-container > ul > li > img {
                            max-width: 15%;
                        }

                        .intro-container > ul > li.sm > img {
                            margin-right: 1rem;
                            max-width: 5%;
                        }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: ` 
                .paper-airplane {
                    bottom: 10%;
                    width: 40%;
                }

                .feature-container {
                    padding: 3.5rem 10rem;
                }

                    .feature-container > div {
                        padding: 6rem;
                    }

                .intro-container {
                    padding-left: 10rem;
                }

                .intro-container > ul {
                    padding: 20rem 10rem 15rem 0;
                }
            `
        }, {
            constraint: 'min',
            width: '1280px',
            rules: `
                .bg-second-layer {
                    background-position-x: right;
                }

                .paper-airplane {
                    bottom: 10%;
                    left: 10%;
                    width: 25%;
                }
        
                .frog {
                    top: 15%;
                    right: 10%;
                    width: 15%;
                }
            
                .feature-container {
                    padding: 3.5rem 5rem;
                }
                
                    .feature-container > div {
                        flex: 1 1 50%;
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
                    align-items: center;
                    padding-left: 0;
                    padding-right: 20rem;
                }

                    .intro-container > .front-img {
                        flex: 1 1 auto;
                        position: relative;
                        left: -5%;
                        width: 50%;
                        max-height: 100%;
                    }

                    .intro-container > ul {
                        background-position-y: center;
                        flex: 1 1 50%;
                        padding: 0 0 0 10rem;
                    }

                        .intro-container > ul > li {
                            text-align: center;
                        }

                            .intro-container > ul > li > img {
                                max-width: 20%;
                            }

                            .intro-container > ul > li.sm > img {
                                max-width: 10%;
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
                <img alt='paper-airplane' src={PaperAirPlaneSmaillImage} 
                    srcSet={`
                        ${PaperAirPlaneSmaillImage} 300w, 
                        ${PaperAirPlaneMediumImage} 1000w,
                        ${PaperAirPlaneLargeImage} 2000w
                    `} 
                    className='paper-airplane' />
                <img alt='paper-frog' src={PaperFrogSmallImage} 
                    srcSet={`
                        ${PaperFrogSmallImage} 300w, 
                        ${PaperFrogMediumImage} 1000w,
                        ${PaperFrogLargeImage} 2000w
                    `}
                    className='frog' />
                <p className='banner-header'>輕量級筆記應用</p>
                <button className='start-btn' onClick={loadEntry}>開始使用</button>
            </div>
            <div className='feature-container'>
                <div><img alt='WYSIWYG' src={WYSIWYGImage} /></div>
                <div className='desc-block'>
                    <p className='title'>所見即所得</p>
                    <p className='desc'>What You See Is What You Get，縮寫WYSIWYG</p>
                    <p className='desc'>您在編輯器所見的畫面與儲存後呈現的畫面一致，不需要擔心筆記格式跑掉。</p>
                </div>
                <div className='desc-block'>
                    <p className='title'>豐富的文字編輯功能</p>
                    <p className='desc'>您可以自由的調整想要的文字樣式、段落格式、編號...</p>
                    <p className='desc'>也可以上傳圖片、插入表格。</p>
                </div>
                <div><img alt='rich-edit-function' src={RichEditFunctionImage} /></div>
                <div><img alt='auto-save' src={AutosaveImage} /></div>
                <div className='desc-block'>
                    <p className='title'>自動儲存</p>
                    <p className='desc'>筆記編輯模式下每隔一段時間即自動儲存至後台資料庫。</p>
                    <p className='tip'>(自動儲存間隔時間：5分鐘)</p>
                </div>
                <div className='desc-block'>
                    <p className='title'>隱私安全</p>
                    <p className='desc'>您所撰寫的任何內容全部加密儲存，安全的存放在後台資料庫。</p>
                </div>
                <div><img alt='secure' src={SecureImage} /></div>
            </div>   
            <div className='intro-container'>
                <img alt='squirrel-with-pen' className='front-img' src={SquirrelWithPenSmallImage}
                    srcSet={`
                    ${SquirrelWithPenSmallImage} 300w, 
                    ${SquirrelWithPenLargeImage} 1000w
                `}></img>
                <ul>
                    <li><img alt='light-bulb' src={LightBulbSmallImage}
                            srcSet={`
                                ${LightBulbSmallImage} 300w, 
                                ${LightBulbMediumImage} 1000w,
                                ${LightBulbLargeImage} 2000w
                            `} />
                        整理你的思緒
                    </li>
                    <li className='sm'>
                        <img alt='balloon' src={BalloonSmallImage}
                            srcSet={`
                                ${BalloonSmallImage} 300w, 
                                ${BalloonMediumImage} 1000w,
                                ${BalloonLargeImage} 2000w
                        `} />
                        記錄珍貴回憶
                    </li>
                    <li><img alt='brain' src={BrainSmallImage}
                            srcSet={`
                                ${BrainSmallImage} 300w, 
                                ${BrainMediumImage} 1000w,
                                ${BrainLargeImage} 2000w
                        `} />
                        學習更有效率
                    </li>
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