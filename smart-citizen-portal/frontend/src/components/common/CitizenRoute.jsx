import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * CitizenRoute
 * Wraps routes that should only be accessible by users with role === 'citizen'.
 * - If not authenticated → redirect to /login
 * - If authenticated but not citizen (e.g. admin) → redirect to admin dashboard
 */
const CitizenRoute = ({ children }) => {
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

  if (user.role !== 'citizen') {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default CitizenRoute;
