import React, { useState, useContext } from 'react';
import { 
    Form, 
    FormGroup, 
    Label, 
    Input
} from 'reactstrap';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import { REGISTER, FORGOT_PWD } from '../../modelTypes';

//Import Style
import AuthPanel from '../../style/components/AuthPanel';

const Login = props => {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;

    const { login } = authContext;

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const { email, password } = user;

    const { toggleModel, toggleOpen } = props;

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
            setAlert('請填寫所有欄位', 'danger');
        }
        else{
            login({
                email,
                password
            });
            toggleOpen();
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
                <FormGroup>
                    <Label htmlFor='password'>密碼</Label>
                    <Input type='password' name='password' value={password} onChange={onChange} required />
                </FormGroup>
                <input type='submit' value='登入' className='btn btn-block' />
            </Form>
            <p className='column'>
                <a href='#' onClick={toggleRegister}>建立帳號</a>
                <a href='#' onClick={toggleForgotPassword}>忘記密碼</a>
            </p>
        </AuthPanel>
    )
}

export default Login;