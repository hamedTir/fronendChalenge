// darkTheme.ts
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set the theme type to dark
    primary: {
      main: '#2196F3', // Adjust primary color
    },
    secondary: {
      main: '#FF5722', // Adjust secondary color
    },
  },
  // Add more theme configurations if needed
});

export default darkTheme;
