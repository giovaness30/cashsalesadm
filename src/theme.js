import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#6F6F6F',
    },
    secondary: {
      main: '#fff',
    },
    header:{
      main: '#fff',
    },
    error: {
      main: red.A400,
    },
  
  },

});

export default theme;
