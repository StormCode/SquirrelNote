import React, { useContext, useEffect } from 'react';
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

import AuthContext from '../../context/auth/authContext';

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
    const { isAuthenticated } = authContext;
    const { 
        model, 
        isOpen, 
        toggleModel, 
        toggleOpen 
    } = props;
    
    useEffect(() => {
        //todo
        isAuthenticated && history.push('/notebook');
    }, [isAuthenticated]);

    return (
        <ModelsContext.Provider
            value={{
                model: model,
                toggleOpen: toggleOpen,
                toggleModel: toggleModel
            }}>
                {isOpen ? <Modal isOpen={isOpen} toggle={toggleOpen}>
                    <ModelStyle>
                        <ModalBody>
                            {props.children}
                        </ModalBody>
                    </ModelStyle>
                </Modal> : null}
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