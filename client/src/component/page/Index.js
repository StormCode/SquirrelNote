import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CheckSquareOffset } from "phosphor-react";
import AuthModels from '../auth/AuthModels';

// Import Resource
import BackgroundImage from '../../assets/index/background_icons.png';
import FrontImage from '../../assets/index/front_image.png';
import NoteImage from '../../assets/index/background_note.png';
import WYSIWYGImage from '../../assets/index/WYSIWYG.png';
import RichEditFunctionImage from '../../assets/index/rich_edit_function.png';
import AutosaveImage from '../../assets/index/autosave.png';
import SecureImage from '../../assets/index/secure.png';

// Import Style
import { theme } from '../../style/themes';

import AuthContext from '../../context/auth/authContext';

import { REGISTER } from '../../modelTypes';

const { orange, lightOrange, darkOrange, blue } = theme;

const Container = styled.div`
    @keyframes slidein {
        to {
            bottom: 60%;
            color: rgba(0, 0, 0, 1);
        }
    }

    background: url(${BackgroundImage}) #D4D4D4;
    width: 100%;

    .banner {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50vh;
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
        background: linear-gradient(${orange}, ${darkOrange});
        position: relative;
        border: none;
        border-radius: 10px;
        color: #FFF;
        font-size: 2rem;
        font-weight: 300;
        padding: 1rem 1.5rem;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, .5);
    
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
            background: ${orange};
            font-weight: 500;
        }
    
        &:hover:after {
            background: linear-gradient(${lightOrange}, rgba(255, 255, 255, .1));
        }
    }

    .feature-container {
        background: rgba(255, 255, 255, .8);
        margin: 3rem auto;
        width: 90%;
        display: flex;
        flex-flow: row wrap;    
    }

        .feature-container > div {
            flex: 1 1 50%;
            padding: .5rem;
            height: 300px;
        }

        .feature-container > div:not(.desc-block) {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
        }

        .feature-container > div.desc-block {
            background: rgba(0, 15, 90, .75);
            background-clip: content-box;
        }

            .feature-container > div > .title {
                font-size: 1.5rem;
                font-weight: bold;
                line-height: 5rem;
                text-indent: 1rem;
                color: #FFF;
            }

            .feature-container > div > img {
                max-width: 100%;
                max-height: 100%;
            }

    .intro-container {
        background: url(${NoteImage}) right center/contain no-repeat local;
        position: relative;
        display: flex;
        flex-flow: row nowrap;
    }

        .intro-container > ul {
            flex: 1 1 50%;
            position: relative;
            text-align: center;
            margin-top: 5rem;
        }

            .intro-container > ul > li {
                font-size: 1.5rem;
                line-height: 5rem;
                color: ${blue};
                text-decoration: underline;
            }

            .intro-container > .front-img {
                flex: 1 1 50%;
                position: relative;
                margin-top: 2rem;
                margin-left: -5%;
                max-width: 60vw;
                max-height: 100%;
            }

    .mask {
        background: rgba(255, 255, 255, .5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
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
                <div className='mask'></div>
                <p className='banner-header'>輕量級筆記應用</p>
                <button className='start-btn' onClick={loadEntry}>開始使用</button>
            </div>
            <div className='feature-container'>
                <div><img src={WYSIWYGImage} /></div>
                <div className='desc-block'><p className='title'>所見即所得</p></div>
                <div className='desc-block'><p className='title'>豐富的文字編輯功能</p></div>
                <div><img src={RichEditFunctionImage} /></div>
                <div><img src={AutosaveImage} /></div>
                <div className='desc-block'><p className='title'>自動儲存</p></div>
                <div className='desc-block'><p className='title'>隱私安全</p></div>
                <div><img src={SecureImage} /></div>
            </div>   
            <div className='intro-container'>
                <div className='mask'></div>
                <img className='front-img' src={FrontImage}></img>
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