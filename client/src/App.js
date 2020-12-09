import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './style/themes';
import { GlobalStyles } from './style/global';
import Navbar from './component/layout/Navbar'
import Footer from './component/layout/Footer'
import Alerts from './component/layout/Alerts'
import AuthUser from './component/page/AuthUser'
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

const AppStyle = styled.div`
    #container {
        display: flex;
        flex-flow: nowrap column;
        width: 100%;
        height: 100vh;
    }

    .header {
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .main {
        flex: 1 1 80%;
        display: flex;
        flex-flow: wrap row;
        justify-content: center;
        align-items: center;
    }

    .footer {
        flex: 1 0 auto;
        background-color: #ffe094;
        background-image: linear-gradient(0deg, #ffe094 0%, rgba(255,255,255,.9) 100%);
        text-align: center;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        min-height: 100px;

        > p:before {
            content: '';
            height: 100%;
            display: inline-block;
            vertical-align: middle;
        }
    }
`;

if (localStorage.token) {
    setAuthToken(localStorage.token)
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <AppStyle>
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
                                                            path="/AuthUser/:token"
                                                            component={AuthUser}
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
            </AppStyle>
        </ThemeProvider>
    )
}

export default App
