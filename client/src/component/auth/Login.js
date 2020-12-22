import React, { useState, useContext, useEffect } from 'react';
import { 
    Alert, 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

import AuthContext from '../../context/auth/authContext';
import { REGISTER, FORGOT_PWD } from '../../modelTypes';
import {
    INVALID_CREDENTIALS,
    NOT_AUTHORIZED
} from '../../status';

const Login = props => {
    const authContext = useContext(AuthContext);

    const { login, isAuthenticated, error, clearErrors } = authContext;
    
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [formAuthError, setFormAuthError] = useState(null);
    const { email, password } = user;

    const { toggleModel } = props;
    
    useEffect(() => {
        if(error === INVALID_CREDENTIALS) {
            setFormAuthError('帳號密碼不正確');
            clearErrors();
        }
        else if(error === NOT_AUTHORIZED) {
            setFormAuthError('帳號未啟用');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated]);

    const toggleRegister = () => {
        toggleModel(REGISTER);
    }

    const toggleForgotPassword = () => {
        toggleModel(FORGOT_PWD);
    }

    const onChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        if(email === '' || password === '') {
            setFormAuthError('請填寫所有欄位');
        }
        else{
            setFormAuthError(null);
            login({
                email,
                password
            });
        }
    };

    return (
        <div>
            {/* 頁面跳轉至notebook */}
            {isAuthenticated && window.location.replace('/notebook')}
            <h2 className='title'>{props.title}</h2>
                {(formAuthError !== null && formAuthError !== '') &&
                    <Alert color="danger">
                        {formAuthError}
                    </Alert>}
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' name='email' value={email} onChange={onChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='password'>密碼</Label>
                    <Input type='password' name='password' value={password} onChange={onChange} required />
                </FormGroup>
                <input type='submit' value='登入' className='btn btn-block' />
            </Form>
            <p className='column'>
                <a href='#!' onClick={toggleRegister}>建立帳號</a>
                <a href='#!' onClick={toggleForgotPassword}>忘記密碼</a>
            </p>
        </div>
    )
}

export default Login;