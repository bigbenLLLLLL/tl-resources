import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Register from '../pages/Register';
import Login from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Add more routes here as needed */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
}
