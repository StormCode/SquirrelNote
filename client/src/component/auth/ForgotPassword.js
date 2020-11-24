import React, { useState, useContext } from 'react';
import axios from 'axios';
import { 
    Alert, 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const ForgotPassword = props => {
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;

    const [email, setEmail] = useState('');
    const [emailSended, setEmailSended] = useState(null);

    const onChange = e => setEmail(e.target.value);

    const onSubmit = async e => {
        e.preventDefault();
        if(email === '') {
            setAlert('請填寫E-mail', 'danger');
        }
        else{
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    
            try {
                await axios.post('/api/users/forgotPassword', {email}, config);
                setEmailSended(true);
            } catch (err) {
                setEmailSended(false);
            }
        }
    };

    return (
        <AuthPanel className='form-container'>
            <h2 className='title'>{props.title}</h2>
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