import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    FORGOTPASSWORD_SUCCESS,
    FORGOTPASSWORD_FAIL,
    CLEAR_EMAIL_SENDED,
    CLEAR_ERRORS
} from '../types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        emailSended: null,
        error: null
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // 載入User
    const loadUser = async () => {
        if(localStorage.token){
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth');

            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
        } catch (err) {
            dispatch({ 
                type: AUTH_ERROR,
                payload: err.response.data.status || 'Server Error'
             });
        }
    }

    // 登入
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/auth', formData, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.status || 'Server Error'
            });
        }
    }

    // 註冊
    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/users', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.status || 'Server Error'
            });
        }
    }

    // 登出
    const logout = () => dispatch({type: LOGOUT});

    // 忘記密碼
    const forgotPassword = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            await axios.post('/api/users/forgotPassword', formData, config);

            dispatch({ type: FORGOTPASSWORD_SUCCESS });
        } catch (err) {
            dispatch({
                type: FORGOTPASSWORD_FAIL,
                payload: err.response.data.status || 'Server Error'
            });
        }
    }

    // 清除Email寄送狀態
    const clearEmailSended = () => dispatch({type: CLEAR_EMAIL_SENDED});

    // 清除錯誤
    const clearErrors = () => dispatch({type: CLEAR_ERRORS});

    return <AuthContext.Provider
        value={{
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            user: state.user,
            emailSended: state.emailSended,
            error: state.error,
            register,
            loadUser,
            login,
            logout,
            forgotPassword,
            clearEmailSended,
            clearErrors
        }}>
        {props.children}
    </AuthContext.Provider>
};

export default AuthState;