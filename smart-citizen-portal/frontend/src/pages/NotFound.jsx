import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-display font-black text-slate-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Please check the URL or navigate back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
          <Link
            to={getDashboardLink()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {user ? 'Dashboard' : 'Home'}
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-400 mb-3">Helpful links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="text-sm text-primary-600 hover:underline">Home</Link>
            <Link to="/schemes" className="text-sm text-primary-600 hover:underline">Schemes</Link>
            <Link to="/notifications" className="text-sm text-primary-600 hover:underline">Notifications</Link>
            <Link to="/login" className="text-sm text-primary-600 hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
