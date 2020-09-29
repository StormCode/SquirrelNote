import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './component/layout/Navbar'
import Alerts from './component/layout/Alerts'
import Login from './component/auth/Login'
import Register from './component/auth/Register'
import Home from './component/page/Home'
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from './routing/PrivateRoute'

import AuthState from './context/auth/AuthState'
import AlertState from './context/alert/AlertState'
import NotebookState from './context/notebooks/NotebookState'

import './App.css'

if (localStorage.token) {
    setAuthToken(localStorage.token)
}

function App() {
    return (
        <AuthState>
            <AlertState>
                <NotebookState>
                    <Router>
                        <div id="container">
                            <Navbar />
                            <Alerts />
                            <div className='main'>
                                <Switch>
                                    <PrivateRoute
                                        exact
                                        path="/"
                                        component={Home}
                                    ></PrivateRoute>
                                    <Route
                                        exact
                                        path="/Login"
                                        component={Login}
                                    ></Route>
                                    <Route
                                        exact
                                        path="/Register"
                                        component={Register}
                                    ></Route>
                                </Switch>
                            </div>
                            <div className='footer'></div>
                        </div>
                    </Router>
                </NotebookState>
            </AlertState>
        </AuthState>
    )
}

export default App
