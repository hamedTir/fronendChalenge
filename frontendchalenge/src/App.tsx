import { Divider, Chip, Avatar, Container, Typography, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MonitorIcon from '@mui/icons-material/Monitor';

const App = () => {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <BottomNavigation

          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: "350px" }}
        >


          <BottomNavigationAction label="Home" icon={<Link to={"/"}><HomeOutlinedIcon/> 
           </Link> } />
          <BottomNavigationAction label="Monitroring" icon={<Link to={"/user/monitor"}>
            <MonitorIcon />
          </Link>} />
        </BottomNavigation>

        <Container maxWidth={"sm"} >




          <Outlet />
        </Container>
        <ToastContainer />
      </ThemeProvider>
    </>

  );
}

export default App;
