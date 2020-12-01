import React, { Fragment, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
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
`;

const NavText = styled.li`
    font-size: 1.2rem;
    font-weight: 400;
    color: #9e9e9e;

    &:before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
`;

const MainNavbar = ({ title }) => {
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

    const guestLinks = (
        <Fragment>
            <NavItem>
                <NavLink href='#!' onClick={openLogin}>登入</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href='#!' onClick={openRegister}>註冊</NavLink>
            </NavItem>
        </Fragment>
    );

    const userLinks = (
        <Fragment>
            <NavText>
                {user && user.name}
            </NavText>
            <NavItem>
                <NavLink href='#!' onClick={onLogout}>登出</NavLink>
            </NavItem>
        </Fragment>
    );

    return (
        //當路徑在筆記頁面的時候要隱藏Navbar
        location.pathname.match(/notebook\/[0-9\w]+/) ? null :
        <div className="header">
            <NavContainer>
                <Navbar expand="md">
                    <NavbarBrand href="/">{title}</NavbarBrand>
                    <NavbarToggler onClick={toggleMenu} />
                    <Collapse isOpen={menuOpen} navbar>
                        <Nav className="ml-auto" navbar>
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
