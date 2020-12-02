import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { 
    Alert, 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

import AlertContext from '../../context/alert/alertContext';

const ResetPasswordContainer = styled.div`
    padding: 0 5rem;
    width: 100%;

    .title {
        text-align: center;
        padding: 20px 0;
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
`;

const ResetPassword = ({ match }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    const [auth, setAuth] = useState(null);
    
    useEffect(() => {
        async function Auth() {
            try {
                let token = match.params.token;
                await axios.get(`/api/auth/resetPassword/${token}`);
                setAuth(true);
            } catch (err) {
                setAuth(false);
            }
        }
        Auth();

        // eslint-disable-next-line
    },[]);

    const [user, setUser] = useState({
        token: match.params.token,
        password: '',
        confirmPassword: ''
    });

    const { password, confirmPassword } = user;

    const onChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value
    });

    const onSubmit = async e => {
        e.preventDefault();
        if(password === '' || confirmPassword === '') {
            setAlert('請填寫所有欄位', 'danger');
        }
        else if(password !== confirmPassword){
            setAlert('您所輸入的密碼不一致', 'danger');
        }
        else{
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                await axios.post('/api/users/resetPassword/', user, config);
                setAlert('您的密碼已重設，可以重新登入囉！', 'success');
            } catch (err) {
                setAlert('重設密碼發生異常', 'danger');
            }
        }
    };

    return (
        <ResetPasswordContainer className='form-container'>
            <h2 className='title'>重設密碼</h2>
            {auth !== null ?
                (auth === true ?
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label htmlFor='password'>密碼</Label>
                            <Input type='password' name='password' value={password} onChange={onChange} minLength='6' required/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor='confirmPassword'>確認密碼</Label>
                            <Input type='password' name='confirmPassword' value={confirmPassword} onChange={onChange} required/>
                        </FormGroup>
                        <input type='submit' value='重設密碼' className='btn btn-block' />
                    </Form>
                : <Alert color="danger">
                    連結驗證失敗，您的連結無效或已過期
                  </Alert>)
                :null
            }
        </ResetPasswordContainer>
    )
}

export default ResetPassword;