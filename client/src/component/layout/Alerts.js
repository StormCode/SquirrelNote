import React, { useContext } from 'react';
import styled from 'styled-components';
import AlertContext from '../../context/alert/alertContext';

const Alert = styled.span`
    position: fixed;
    bottom: 2rem;
    left: 2.5rem;
    z-index: 9999;
`;

const Alerts = () => {
    const alertContext = useContext(AlertContext);

    return (
        alertContext.alerts.length > 0 && alertContext.alerts.map(alert => (
            <Alert key={alert.id} className={`alert alert-${alert.type}`}>
                {alert.msg}
            </Alert>
        ))
    );
}

export default Alerts;