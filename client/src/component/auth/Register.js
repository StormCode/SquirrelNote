import React, { useState, useContext, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import {
    DUPLICATED_USER
} from '../../status';

const Register = props => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;

    const { register, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/');
        }

        if(error === DUPLICATED_USER) {
            setAlert(error, 'danger');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { name, email, password, confirmPassword } = user;

    const onChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        if(name === '' || email === '' || password === '' || confirmPassword === '') {
            setAlert('請填寫所有欄位', 'danger');
        }
        else if(password !== confirmPassword){
            setAlert('您所輸入的密碼不一致', 'danger');
        }
        else{
            register({
                name,
                email,
                password
            });
        }
    };

    return (
        <div className='form-container auth-container'>
            <h1>
                <span className='text-primary'>註冊</span>
            </h1>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label htmlFor='name'>姓名</Label>
                    <Input type='text' name='name' value={name} onChange={onChange} required/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' name='email' value={email} onChange={onChange} required/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='password'>密碼</Label>
                    <Input type='password' name='password' value={password} onChange={onChange} minLength='6' required/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='confirmPassword'>確認密碼</Label>
                    <Input type='password' name='confirmPassword' value={confirmPassword} onChange={onChange} required/>
                </FormGroup>
                <Input type='submit' value='註冊' className='btn btn-primary btn-block' />
            </Form>
        </div>
    )
}

export default Register;