import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home';
import Profile from './pages/profile';
import Message from './pages/chats';
import Settings from './pages/settings';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProtectedRoutes from './components/ProtectedRoutes';
import ProfileDetails from './components/home/ProfileDetails';

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='forgotPassword' element={<ForgotPassword />} />
      <Route path='resetPassword' element={<ResetPassword />} />

      <Route path='/' element={<Layout />}>
        {/* protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
          <Route path='chats' element={<Message />} />
          <Route path='profile' element={<Profile />} />
          <Route path='settings' element={<Settings />} />
          <Route path='profile/:id' element={<ProfileDetails />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
