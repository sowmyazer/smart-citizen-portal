import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * AdminRoute
 * Wraps routes that should only be accessible by users with role === 'admin'.
 * - If not authenticated → redirect to /login
 * - If authenticated but not admin → redirect to /unauthorized
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user.role !== 'admin') {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default AdminRoute;
