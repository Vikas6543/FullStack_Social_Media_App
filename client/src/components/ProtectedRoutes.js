import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {
  const location = useLocation();
  const { user } = useSelector((state) => ({ ...state.auth }));

  if (user) {
    return <Outlet />;
  } else {
    return (
      <Navigate
        to={{ pathname: '/login', state: { from: location } }}
        replace
      />
    );
  }
};

export default ProtectedRoutes;
