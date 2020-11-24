import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './component/layout/Navbar'
import Footer from './component/layout/Footer'
import Alerts from './component/layout/Alerts'
import ResetPassword from './component/page/ResetPassword'
import Index from './component/page/Index'
import Notebook from './component/page/Notebook'
import Note from './component/page/Note'
import RecycleBin from './component/page/RecycleBin'
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from './routing/PrivateRoute'

import AuthState from './context/auth/AuthState'
import AlertState from './context/alert/AlertState'
import NotebookState from './context/notebooks/NotebookState'
import NotedirState from './context/notedirs/NotedirState'
import NoteState from './context/notes/NoteState'
import RecyclebinState from './context/recyclebin/RecyclebinState'

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
                            <RecyclebinState>
                                <Router>
                                    <div id="container">
                                        <Navbar />
                                        <Alerts />
                                        <div className='main'>
                                            <Switch>
                                                <PrivateRoute
                                                    exact
                                                    path="/Notebook"
                                                    component={Notebook}
                                                ></PrivateRoute>
                                                <PrivateRoute
                                                    exact
                                                    path="/Notebook/:id"
                                                    component={Note}
                                                ></PrivateRoute>
                                                <PrivateRoute
                                                    exact
                                                    path="/RecycleBin"
                                                    component={RecycleBin}
                                                ></PrivateRoute>
                                                <Route
                                                    exact
                                                    path="/"
                                                    component={Index}
                                                ></Route>
                                                <Route
                                                    exact
                                                    path="/Index"
                                                    component={Index}
                                                ></Route>
                                                <Route
                                                    exact
                                                    path="/ResetPassword/:token"
                                                    component={ResetPassword}
                                                ></Route>
                                            </Switch>
                                        </div>
                                        <Footer />
                                    </div>
                                </Router>
                            </RecyclebinState>
                        </NoteState>
                    </NotedirState>
                </NotebookState>
            </AlertState>
        </AuthState>
    )
}

export default App
