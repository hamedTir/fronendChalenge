import { Divider, Chip, Avatar, Container, Typography, Box } from '@mui/material';
import React from 'react';
import './App.css';
import UserList from './User/UserList';
import Person3Icon from '@mui/icons-material/Person3';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './darkTheme'; // Import your dark theme
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={"/"}>

              <Avatar>
                <Person3Icon />
              </Avatar>
            </Link>
            <Typography style={{ marginLeft: '4px', marginTop: '7px' }} variant="h4" gutterBottom>
              Users And Notes Management
            </Typography>
          </div>
        </Box>


        <Container >

          <Outlet />
        </Container>
        <ToastContainer />
      </ThemeProvider>
    </>

  );
}

export default App;
