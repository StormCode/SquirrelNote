import React from 'react';
import PropTypes from 'prop-types';
import { 
    Modal, 
    ModalBody
} from 'reactstrap';
import styled from 'styled-components';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

import { LOGIN, REGISTER, FORGOT_PWD } from '../../modelTypes';

const AuthPanel = styled.div`
    width: 100%;

    .modal-body {
        border-radius: 20px;
        background: #FFF;
        padding: 2rem 1.5rem;
        box-shadow: inset 0 0 25px ${({theme}) => theme.orange}, 5px 5px 10px;
    }

    .title {
        text-align: center;
        padding: 1rem 0;
    }

    input[type='submit'] {
        margin: 30px 0;
        background: ${({theme}) => theme.orange};
    }

    p {
        text-align: center;
    }

        p > a {
            text-decoration: none;
            color: ${({theme}) => theme.orange};
        }

    .column {
        column-count: 2;
    }
    
        .column > a {
            display: block;
        }

    .tip {
        margin-bottom: 10px;
        font-size: .75rem;
        color: ${({theme}) => theme.gray};
    }
`;

const ModelsContext = React.createContext({
    model: null,
    toggleOpen: () => {},
    toggleModel: () => {}
});

const Models = props => {
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
                {isOpen ? <Modal isOpen={isOpen} toggle={toggleOpen}>
                    <AuthPanel>
                        <ModalBody>
                            {props.children}
                        </ModalBody>
                    </AuthPanel>
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