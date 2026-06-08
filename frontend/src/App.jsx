import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Utilities & guards
import ErrorBoundary from './components/common/ErrorBoundary';
import AdminRoute from './components/common/AdminRoute';
import CitizenRoute from './components/common/CitizenRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import { TOAST_CONFIG } from './utils/constants';

// Special pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import SchemesPublic from './pages/public/SchemesPublic';
import NotificationsPublic from './pages/public/NotificationsPublic';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Citizen Pages
import CitizenLayout from './components/citizen/CitizenLayout';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import Profile from './pages/citizen/Profile';
import EligibilityChecker from './pages/citizen/EligibilityChecker';
import EligibilityResults from './pages/citizen/EligibilityResults';
import CitizenNotifications from './pages/citizen/CitizenNotifications';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSchemes from './pages/admin/ManageSchemes';
import AddScheme from './pages/admin/AddScheme';
import EditScheme from './pages/admin/EditScheme';
import ManageNotifications from './pages/admin/ManageNotifications';
import AddNotification from './pages/admin/AddNotification';
import EditNotification from './pages/admin/EditNotification';
import ManageCitizens from './pages/admin/ManageCitizens';
import CitizenDetail from './pages/admin/CitizenDetail';
import Analytics from './pages/admin/Analytics';

import { useAuth } from './context/AuthContext';

/** Redirects logged-in users away from /login and /register */
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ────────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/schemes" element={<SchemesPublic />} />
      <Route path="/notifications" element={<NotificationsPublic />} />

      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

      {/* ── Citizen ───────────────────────────────────────── */}
      <Route
        path="/citizen"
        element={
          <CitizenRoute>
            <CitizenLayout />
          </CitizenRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="eligibility" element={<EligibilityChecker />} />
        <Route path="eligibility/results" element={<EligibilityResults />} />
        <Route path="notifications" element={<CitizenNotifications />} />
      </Route>

      {/* ── Admin ─────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="schemes" element={<ManageSchemes />} />
        <Route path="schemes/add" element={<AddScheme />} />
        <Route path="schemes/edit/:id" element={<EditScheme />} />
        <Route path="notifications" element={<ManageNotifications />} />
        <Route path="notifications/add" element={<AddNotification />} />
        <Route path="notifications/edit/:id" element={<EditNotification />} />
        <Route path="citizens" element={<ManageCitizens />} />
        <Route path="citizens/:id" element={<CitizenDetail />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* ── Error pages ───────────────────────────────────── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <ToastContainer {...TOAST_CONFIG} />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
