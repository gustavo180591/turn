import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TurnManagerNew from './components/TurnManagerNew.jsx';
import ClientDisplay from './components/ClientDisplay.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e8449', // Darker green
      light: '#27ae60',
      dark: '#166938', // Even darker green
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e8449', // Darker green
      secondary: '#1e8449',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#1e8449', // Darker green
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2c3e50',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#2c3e50',
    },
    body1: {
      fontSize: '1rem',
      color: '#34495e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <TurnManagerNew />
      </Box>
    </ThemeProvider>
  );
}

export default App;
