import React, { useState, useContext, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import {
    INVALID_CREDENTIALS
} from '../../status';

const Login = props => {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;

    const { login, error, clearErrors, isAuthenticated } = authContext;

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const { email, password } = user;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/');
        }

        if(error === INVALID_CREDENTIALS) {
            setAlert(error, 'danger');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);

    const onChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        if(email === '' || password === '') {
            setAlert('請填寫所有欄位', 'danger');
        }
        else{
            login({
                email,
                password
            });
        }
    };

    return (
        <div className='form-container auth-container'>
            <h1>
                <span className='text-primary'>登入</span>
            </h1>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' name='email' value={email} onChange={onChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='password'>密碼</Label>
                    <Input type='password' name='password' value={password} onChange={onChange} required />
                </FormGroup>
                <input type='submit' value='登入' className='btn btn-primary btn-block' />
            </Form>
        </div>
    )
}

export default Login;