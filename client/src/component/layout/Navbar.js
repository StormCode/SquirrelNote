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

import AuthContext from '../../context/auth/authContext';

import { LOGIN, REGISTER } from '../../modelTypes';

const NavContainer = styled.div`
    background: linear-gradient(180deg, rgba(255,140,40,1) 0%, rgba(255,149,56,1) 20%, rgba(255,119,0,1) 75%);
    box-shadow: 3px 3px 18px 0px rgba(0,0,0,0.75);

    .navbar-nav {
        flex: 1 1 auto;
    }

    .nat-link-active {
        color: #FDFF6F;
    }

    .nav-link:not(.nat-link-active) {
        color: #FFF;
    }
        
        .nav-link:hover {
            color: #EBED68;
        }

        .nav-item:not(.nat-link-active):after {
            background: #FFF;
        }

        .nat-link-active:after {
            background: #FDFF6F;
        }

        .nav-link:after {
            content: '';
            display: block;
            height: 3px;
        }

            .nav-link:hover:after {
                background: #EBED68;
            }

    .right-nav-items {
        display: flex;
        margin-left: auto;
    }
`;

const NavText = styled.li`
    font-size: 1.15rem;
    font-weight: 400;
    color: #FFF;
    margin-right: .5rem;

    &:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
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
                <NavLink href='#!' className={location.pathname.match(/notebook(?!\/)/g) ? 'nat-link-active' : null} onClick={loadNotebook}>
                    筆記本
                </NavLink>
            </NavItem>
            <span className="right-nav-items">
                <NavText>
                    {user && user.name}
                </NavText>
                <NavItem>
                    <NavLink href='#!' onClick={onLogout}>登出</NavLink>
                </NavItem>
            </span>
        </Fragment>
    );

    return (
        <div className="header">
            <NavContainer>
                <Navbar expand="md">
                    <NavbarBrand href="/">{title}</NavbarBrand>
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
