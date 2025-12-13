import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#7c4dff',
    },
    background: {
      default: '#0b1020',
      paper: '#0f1724',
    },
    text: {
      primary: '#e6f7ff',
      secondary: '#9fb6c8',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
