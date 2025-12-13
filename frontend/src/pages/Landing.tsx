import { Box } from '@mui/material';
import Header from '../features/landing/Header';
import LandingBody from '../features/landing/LandingBody';

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <LandingBody />
    </Box>
  );
}
