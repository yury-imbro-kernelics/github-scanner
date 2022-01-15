import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'urql';
import { CssBaseline, Grid, ThemeProvider } from '@mui/material';
import { graphqlClient } from './graphqlClient';
import { RepoDetails } from './components/RepoDetails';
import { Header } from './components/Header';
import { Repos } from './components/Repos';
import { createTheme } from '@mui/material';

function Root() {
    const [dark, setDark] = useState(false);
    const toggleTheme = () => setDark(!dark);
    const theme = createTheme({
        palette: {
            mode: dark ? 'dark' : 'light',
        },
    });
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Provider value={graphqlClient}>
                    <Router>
                        <Grid container p={2}>
                            <Header toggleTheme={toggleTheme} />
                            <Routes>
                                <Route path="/" element={<Repos />} />
                                <Route path="/repo/:name" element={<RepoDetails />} />
                            </Routes>
                        </Grid>
                    </Router>
                </Provider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));
