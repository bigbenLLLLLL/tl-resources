import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import AppThemeProvider from './providers/ThemeProvider';
import AuthProvider from './providers/AuthProvider';

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
