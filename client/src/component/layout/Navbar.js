import React, { Fragment, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import styled from 'styled-components';
import AuthModels from '../auth/AuthModels';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import {
    MediumAndAbove,
} from '../../utils/breakpoints.jsx';

import AuthContext from '../../context/auth/authContext';

import { LOGIN, REGISTER } from '../../modelTypes';

const NavContainerBaseStyle = `
    background: linear-gradient(180deg, rgba(255,140,40,1) 0%, rgba(255,149,56,1) 20%, rgba(255,119,0,1) 75%);
    box-shadow: 3px 3px 18px 0px rgba(0,0,0,0.75);

    .navbar-nav {
        flex: 1 1 auto;
    }

    .nav-link-active {
        color: #FDFF6F !important;
    }

    .nav-link:not(.nav-link-active) {
        color: #FFF;
    }
        
        .nav-link:hover {
            color: #EBED68 !important;
        }

        .nav-item:not(.nav-link-active):after {
            background: #FFF;
        }

        .nav-link:after {
            content: '';
            display: block;
            height: 3px;
        }

    .right-nav-items {
        display: flex;
    }

        .right-nav-items > div:after {
            content: '';
            width: 0;
            height: 100%;
        }

    .nav-text {
        display: inline-block;
        height: 1.15rem;
        font-size: 1.15rem;
        font-weight: 400;
        color: #FFF;
        margin-right: .5rem;
        vertical-align: middle;
    }
`;

const NavContainerResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .nav-link-active:after {
                    background: none;
                }
        
                .nav-link:hover:after {
                    background: none;
                }

                .right-nav-items {
                    flex-flow: column wrap;
                    margin-left: 0;
                    padding: 0;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .nav-link-active:after {
                    background: #FDFF6F;
                }
        
                .nav-link:hover:after {
                    background: #EBED68;
                }

                .right-nav-items {
                    flex-flow: row wrap;
                    margin-left: auto;
                }
            `
        }
    ]);
}

const NavContainer = styled.div`
    ${NavContainerBaseStyle}
    ${NavContainerResponsiveStyle()}
`;

const MainNavbar = ({ title }) => {
    const history = useHistory();
    const location = useLocation();

    const authContext = useContext(AuthContext)

    const [menuOpen, setMenuOpen] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);
    const [model, setModel] = useState(null);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleOpen = () => setModelOpen(!modelOpen);
    const toggleModel = model => setModel(model);
    const openRegister = () => {
        toggleOpen();
        toggleModel(REGISTER);
    }
    const openLogin = () => {
        toggleOpen();
        toggleModel(LOGIN);
    }

    const { isAuthenticated, logout, user } = authContext;

    const onLogout = () => {
        logout();
    }

    const loadHomePage = () => {
        history.push('/');
    }

    const loadNotebook = () => {
        history.push('/notebook');
    }

    const guestLinks = (
        <span className="right-nav-items">
            <NavItem>
                <NavLink href='#!' onClick={openLogin}>登入</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href='#!' onClick={openRegister}>註冊</NavLink>
            </NavItem>
        </span>
    );

    const userLinks = (
        <Fragment>
            <NavItem>
                <NavLink href='#!' className={location.pathname.match(/notebook(?!\/)/g) ? 'nav-link-active' : null} onClick={loadNotebook}>
                    筆記本
                </NavLink>
            </NavItem>
            <ul className="right-nav-items">
                <MediumAndAbove>
                    <li className='nav-text'>
                        {user && user.name}
                    </li>
                </MediumAndAbove>
                <NavItem>
                    <NavLink href='#!' onClick={onLogout}>登出</NavLink>
                </NavItem>
            </ul>
        </Fragment>
    );

    return (
        <div className="header">
            <NavContainer>
                <Navbar expand="md" dark>
                    <NavbarBrand href='#!' onClick={loadHomePage}>{title}</NavbarBrand>
                    <NavbarToggler onClick={toggleMenu} />
                    <Collapse isOpen={menuOpen} navbar>
                        <Nav navbar>
                            {isAuthenticated ? userLinks : guestLinks}
                        </Nav>
                    </Collapse>
                </Navbar>
            </NavContainer>
            <AuthModels
                model={model}
                isOpen={modelOpen}
                toggleModel={toggleModel}
                toggleOpen={toggleOpen}>
                <AuthModels.Login>登入</AuthModels.Login>
                <AuthModels.Register>註冊</AuthModels.Register>
                <AuthModels.ForgotPassword>忘記密碼</AuthModels.ForgotPassword>
            </AuthModels>
        </div>
    )
}

MainNavbar.propTypes = {
    title: PropTypes.string.isRequired
}

MainNavbar.defaultProps = {
    title: 'Squirrel Note'
}

export default MainNavbar;
