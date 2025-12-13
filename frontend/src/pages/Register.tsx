import { Container, Box, Typography } from '@mui/material';
import RegisterForm from '../features/auth/RegisterForm';

export default function Register() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Create account
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
}
