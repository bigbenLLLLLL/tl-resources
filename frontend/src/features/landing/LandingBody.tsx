import { Container, Box } from '@mui/material';
import Hero from './Hero';

export default function LandingBody() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Hero />
      </Box>
    </Container>
  );
}
