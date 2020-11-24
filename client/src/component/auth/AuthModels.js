import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Modal, 
    ModalBody
} from 'reactstrap';
import styled from 'styled-components';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import {
    INVALID_CREDENTIALS
} from '../../status';
import { LOGIN, REGISTER, FORGOT_PWD } from '../../modelTypes';

const ModelStyle = styled.div`
    .modal-content {
        border: none;
        background: none;
    }

    .modal-body {
        border-radius: 20px;
        background: #FFF;
        box-shadow: inset 0 0 25px rgba(255,128,0,1), 5px 5px 10px;
    }
`;

const ModelsContext = React.createContext({
    model: null,
    toggleOpen: () => {},
    toggleModel: () => {}
});

const Models = props => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { error, clearErrors, isAuthenticated } = authContext;
    const { setAlert } = alertContext;

    useEffect(() => {
        if(isAuthenticated) {
            history.push('/notebook');
        }

        if(error === INVALID_CREDENTIALS) {
            setAlert(error, 'danger');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated]);

    const { 
        model, 
        isOpen, 
        toggleModel, 
        toggleOpen 
    } = props;

    return (
        <ModelsContext.Provider
            value={{
                model: model,
                toggleOpen: toggleOpen,
                toggleModel: toggleModel
            }}>
                <Modal isOpen={isOpen} toggle={toggleOpen}>
                    <ModelStyle>
                        <ModalBody>
                            {props.children}
                        </ModalBody>
                    </ModelStyle>
                </Modal>
        </ModelsContext.Provider>
    )
}

Models.Login = ({children}) =>
    <ModelsContext.Consumer>
        {contextValue => 
            contextValue.model === LOGIN ?
                <Login 
                    title={children} 
                    toggleOpen={contextValue.toggleOpen}
                    toggleModel={contextValue.toggleModel} />
            : null
        }
    </ModelsContext.Consumer>;

Models.Register = ({children}) =>
    <ModelsContext.Consumer>
        {contextValue =>
            contextValue.model === REGISTER ?
                <Register 
                    title={children}
                    toggleModel={contextValue.toggleModel} /> 
            : null
        }
    </ModelsContext.Consumer>;

Models.ForgotPassword = ({children}) =>
    <ModelsContext.Consumer>
        {contextValue =>
            contextValue.model === FORGOT_PWD ?
                <ForgotPassword title={children} />
            : null
        }
    </ModelsContext.Consumer>;

Models.defaultProps = {
    model: null,
    isOpen: false,
    toggleModel: () => {},
    toggleOpen: () => {}
};

Models.protoTypes = {
    model: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    isOpen: PropTypes.bool.isRequired, 
    toggleModel: PropTypes.func.isRequired, 
    toggleOpen : PropTypes.func.isRequired
};

export default Models;