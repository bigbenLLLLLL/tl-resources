import { Container, Box, Typography } from '@mui/material';
import LoginForm from '../features/auth/LoginForm';

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Sign in
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
}
