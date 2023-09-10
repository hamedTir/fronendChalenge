import { Divider, Chip, Avatar, Container, Typography, Box } from '@mui/material';
import React from 'react';
import './App.css';
import UserList from './User/UserList';
import Person3Icon from '@mui/icons-material/Person3';

const App = () => {
  return (
    <>
      <Box>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar>
            <Person3Icon />
          </Avatar>
          <Typography style={{marginLeft: '4px', marginTop: '7px'}} variant="h4" gutterBottom>
            Users And Notes Management
          </Typography>
        </div>
      </Box>

      <Divider style={{ marginBottom: '15px' }}>
        <Chip label="USERS" />
      </Divider>
      <Container maxWidth="sm">

        <UserList />
      </Container>
    </>

  );
}

export default App;
