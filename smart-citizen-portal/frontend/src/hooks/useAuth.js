import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — exposes all AuthContext values plus derived helpers.
 *
 * Usage:
 *   const { user, isAdmin, isCitizen, isAuthenticated, login, logout } = useAuth();
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  const {
    user,
    loading,
    login,
    logout,
    updateUser,
  } = context;

  /** True when the user object is populated */
  const isAuthenticated = !!user;

  /** True when logged-in user has role 'admin' */
  const isAdmin = user?.role === 'admin';

  /** True when logged-in user has role 'citizen' */
  const isCitizen = user?.role === 'citizen';

  /**
   * Returns the correct dashboard path for the current user.
   * Falls back to '/' if not logged in.
   */
  const getDashboardPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard';
  };

  /**
   * Returns initials from the user's name (up to 2 chars).
   * e.g. "Ravi Kumar" → "RK"
   */
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const parts = user.name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /**
   * Returns a greeting based on the current time of day.
   */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  /**
   * Checks if user's profile is considered "complete" for eligibility matching.
   * Requires age, caste, occupation, and annualIncome.
   */
  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.age && user.caste && user.occupation && user.annualIncome !== undefined);
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isCitizen,
    getDashboardPath,
    getUserInitials,
    getGreeting,
    isProfileComplete,
  };
};

export default useAuth;
