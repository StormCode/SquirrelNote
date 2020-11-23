import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import {
    DUPLICATED_USER
} from '../../status';
import { LOGIN } from '../../modelTypes';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const Register = props => {
    const history = useHistory();
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;

    const { register, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if(isAuthenticated) {
            history.push('/');
        }

        if(error === DUPLICATED_USER) {
            setAlert(error, 'danger');
            clearErrors();
        }

        // eslint-disable-next-line
    }, [error, isAuthenticated]);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { name, email, password, confirmPassword } = user;

    const { toggleModel } = props;

    const toggleLogin = () => {
        toggleModel(LOGIN);
    }

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
        <AuthPanel className='form-container'>
            <h2>{props.title}</h2>
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
                <Input type='submit' value='註冊' className='btn btn-block' />
            </Form>
            <p>
                <a href='#' onClick={toggleLogin}>已有帳號？</a>
            </p>
        </AuthPanel>
    )
}

export default Register;