import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
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
import NotedirState from './context/notedirs/NotedirState'
import NoteState from './context/notes/NoteState'
import RecyclebinState from './context/recyclebin/RecyclebinState'

const AppStyle = styled.div`
    #container {
        display: flex;
        flex-flow: nowrap column;
        overflow: auto;
        width: 100%;
        min-height: 100vh;
    }

    .main {
        flex: 1 1 auto;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        overflow: hidden;
        height: 100%;
    }

    .footer {
        flex: 0 1 auto;
        background-color: ${({theme}) => theme.orange};
        background-image: linear-gradient(0deg, ${({theme}) => theme.orange} 0%, rgba(255,255,255,.9) 100%);
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
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <AppStyle>
                    <AuthState>
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
                    </AuthState>
                </AppStyle>
            </ThemeProvider>
        </Provider>
    )
}

export default App
