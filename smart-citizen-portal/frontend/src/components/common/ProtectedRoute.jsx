import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * Redirects to /login if not authenticated.
 * Saves the attempted path in location.state so Login can redirect back.
 */
const ProtectedRoute = ({ children }) => {
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

  return children;
};

export default ProtectedRoute;
