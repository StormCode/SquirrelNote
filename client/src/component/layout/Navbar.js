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

import AuthContext from '../../context/auth/authContext';

const MainNavbar = ({ title }) => {
    const location = useLocation();

    const authContext = useContext(AuthContext)

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const { isAuthenticated, logout, user } = authContext;

    const onLogout = () => {
        logout()
    }

    const guestLinks = (
        <Fragment>
            <NavItem>
                <NavLink href="/login">登入</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/register">註冊</NavLink>
            </NavItem>
        </Fragment>
    );

    const userLinks = (
        <Fragment>
            <NavItem>
                <NavLink href="#!" onClick={onLogout}>登出</NavLink>
            </NavItem>
        </Fragment>
    );

    return (
        //當路徑在筆記頁面的時候要隱藏Navbar
        location.pathname.match(/notebook\/[0-9\w]+/) ? null :
        <Navbar className="header" color="dark" dark expand="md">
            <NavbarBrand href="/">{title}</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    {isAuthenticated ? userLinks : guestLinks}
                </Nav>
            </Collapse>
        </Navbar>
    )
}

MainNavbar.propTypes = {
    title: PropTypes.string.isRequired
}

MainNavbar.defaultProps = {
    title: 'Squirrel Note'
}

export default MainNavbar;
