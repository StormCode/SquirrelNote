import React, { useState, useContext, useEffect } from 'react';
import { 
    Alert, 
    Form,
    FormGroup, 
    Label, 
    Input 
} from 'reactstrap';

import AuthContext from '../../context/auth/authContext';
import {
    DUPLICATED_USER
} from '../../status';
import { LOGIN } from '../../modelTypes';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const Register = props => {
    const authContext = useContext(AuthContext);

    const [formAuthError, setFormAuthError] = useState(null);

    const { register, error, clearErrors, emailSended, clearEmailSended } = authContext;

    useEffect(() => {
        if(error === DUPLICATED_USER) {
            setFormAuthError('帳號已經被註冊過了！');
            clearErrors();
        }

        return () => {
            clearEmailSended();
        }

        // eslint-disable-next-line
    }, [error]);

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
            setFormAuthError('請填寫所有欄位');
        }
        else if(password !== confirmPassword){
            setFormAuthError('您所輸入的密碼不一致');
        }
        else{
            setFormAuthError(null);
            register({
                name,
                email,
                password
            });
        }
    };

    return (
        <AuthPanel className='form-container'>
            <h2 className='title'>{props.title}</h2>
            {(formAuthError !== null && formAuthError !== '') &&
                    <Alert color="danger">
                        {formAuthError}
                    </Alert>}
            {emailSended !== null ?
                (emailSended === true ?
                    <Alert color="success">
                        已寄送帳號啟用信至您的信箱，請點擊信件中的連結啟用
                    </Alert> 
                : <Alert color="danger">
                    帳號啟用信發送發生異常，請檢查您的email是否正確
                  </Alert>)
                :null
            }
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
                    <Input type='password' name='password' value={password} onChange={onChange} placeholder='請輸入6位以上的字元、數字或符號' minLength='6' required/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='confirmPassword'>確認密碼</Label>
                    <Input type='password' name='confirmPassword' value={confirmPassword} onChange={onChange} required/>
                </FormGroup>
                <Input type='submit' value='註冊' className='btn btn-block' />
            </Form>
            <p>
                <a href='#!' onClick={toggleLogin}>已有帳號？</a>
            </p>
        </AuthPanel>
    )
}

export default Register;