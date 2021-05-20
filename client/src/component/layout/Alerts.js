import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Alert = styled.span`
    position: fixed;
    bottom: 2rem;
    left: 2.5rem;
    z-index: 9999;
`;

const Alerts = ({ alerts }) => {

    return (
        alerts.length > 0 && alerts.map(alert => (
            <Alert key={alert.id} className={`alert alert-${alert.type}`}>
                {alert.msg}
            </Alert>
        ))
    );
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateProps = state => ({
    alerts: state.alerts
});

export default connect(mapStateProps)(Alerts);