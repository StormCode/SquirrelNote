import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './component/layout/Navbar'
import Footer from './component/layout/Footer'
import Alerts from './component/layout/Alerts'
import Login from './component/auth/Login'
import Register from './component/auth/Register'
import Notebook from './component/page/Notebook'
import Note from './component/page/Note'
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from './routing/PrivateRoute'

import AuthState from './context/auth/AuthState'
import AlertState from './context/alert/AlertState'
import NotebookState from './context/notebooks/NotebookState'
import NotedirState from './context/notedirs/NotedirState'
import NoteState from './context/notes/NoteState'

// Import Style
import './App.css'

if (localStorage.token) {
    setAuthToken(localStorage.token)
}

function App() {
    return (
        <AuthState>
            <AlertState>
                <NotebookState>
                    <NotedirState>
                        <NoteState>
                            <Router>
                                <div id="container">
                                    <Navbar />
                                    <Alerts />
                                    <div className='main'>
                                        <Switch>
                                            <PrivateRoute
                                                exact
                                                path="/"
                                                component={Notebook}
                                            ></PrivateRoute>
                                            <PrivateRoute
                                                exact
                                                path="/Notebook/:id"
                                                component={Note}
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
                                    <Footer />
                                </div>
                            </Router>
                        </NoteState>
                    </NotedirState>
                </NotebookState>
            </AlertState>
        </AuthState>
    )
}

export default App
