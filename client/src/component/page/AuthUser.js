import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'reactstrap';

const AuthUser = ({ match }) => {
    const [auth, setAuth] = useState(null);
    
    useEffect(() => {
        async function Auth() {
            try {
                let token = match.params.token;
                await axios.get(`/api/auth/authUser/${token}`);
                setAuth(true);
            } catch (err) {
                setAuth(false);
            }
        }
        Auth();

        // eslint-disable-next-line
    },[]);

    return (
        <div className='form-container'>
            {auth !== null ?
                (auth === true ?
                    <Alert color="success">
                        您的帳號已啟用，可以登入使用囉！
                    </Alert>
                : <Alert color="danger">
                    連結驗證失敗，您的連結無效或已過期
                  </Alert>)
            :null}
        </div>
    )
}

export default AuthUser;