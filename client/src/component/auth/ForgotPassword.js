import React, { useState, useContext, useEffect } from 'react';
import { 
    Alert, 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';

import AuthContext from '../../context/auth/authContext';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const ForgotPassword = props => {
    const authContext = useContext(AuthContext);
    const { forgotPassword, emailSended, clearEmailSended } = authContext;
    const [email, setEmail] = useState('');
    const [formAuthError, setFormAuthError] = useState(null);

    useEffect(() => {
        return () => {
            clearEmailSended();
        }

        // eslint-disable-next-line
    }, []);

    const onChange = e => setEmail(e.target.value);

    const onSubmit = async e => {
        e.preventDefault();
        if(email === '') {
            setFormAuthError('請填寫E-mail');
        }
        else{
            forgotPassword({email});
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
                        已寄送重設密碼信件至您的email，請點擊email內的連結重設密碼
                    </Alert> 
                : <Alert color="danger">
                    重設密碼信件發送發生異常，請檢查您的email是否正確
                  </Alert>)
                :null
            }
            <p className='tip'>請輸入您註冊時的email，系統將寄送重設密碼信件</p>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' name='email' value={email} onChange={onChange} required />
                </FormGroup>
                <input type='submit' value='寄出重設密碼信' className='btn btn-block' />
            </Form>
        </AuthPanel>
    )
}

export default ForgotPassword;