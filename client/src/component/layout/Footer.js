import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Footer = ({title}) => {
    const location = useLocation();

    return (
        //當路徑在筆記頁面的時候要隱藏Footer
        location.pathname.match('/notebook/') ? null :
        (<div className='footer'>
            <p>Copyright © 2020 {title}</p>
        </div>)
    )
}

Footer.propTypes = {
    title: PropTypes.string.isRequired
}

Footer.defaultProps = {
    title: 'Squirrel Note'
}

export default Footer;
