import React, { useState, useContext } from 'react';
import { 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import { REGISTER } from '../../modelTypes';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const ForgotPassword = props => {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;

    const { forgotPassword } = authContext;

    const [email, setEmail] = useState('');

    const onChange = e => setEmail(e.target.value);

    const onSubmit = e => {
        e.preventDefault();
        if(email === '') {
            setAlert('請填寫E-mail', 'danger');
        }
        else{
            forgotPassword(email);
        }
    };

    return (
        <AuthPanel className='form-container'>
            <h2 className='title'>{props.title}</h2>
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