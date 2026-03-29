import { createTheme } from '@mui/material/styles';

const mcdTheme = createTheme({
  palette: {
    primary: {
      main: '#DA291C', // McDonald's Red
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFC72C', // McDonald's Yellow
      contrastText: '#27251F',
    },
    background: {
      default: '#F5F5F5',
      paper: '#ffffff',
    },
    text: {
      primary: '#27251F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 'bold',
      textTransform: 'none', // McDonald's uses normal casing instead of ALL CAPS for buttons often
      fontSize: '1.1rem',
    },
  },
  shape: {
    borderRadius: 12, // More rounded, friendly shapes
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

export default mcdTheme;
