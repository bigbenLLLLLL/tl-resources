import { AppBar, Toolbar, Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../../components/UserMenu';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" sx={{ px: { xs: 2, md: 6 } }}>
      <Toolbar
        disableGutters
        sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.4 }}
            onClick={() => navigate('/')}
          >
            Luma AI
          </Typography>
        </Box>

        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {useAuth().token ? (
              <UserMenu />
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="contained" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
