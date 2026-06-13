import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsAPI.getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of portal activity</p>
        </div>
        {/* FIX: use relative path — this component renders inside /admin layout */}
        <Link to="/admin/analytics" className="btn-secondary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Full Analytics
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Citizens"
          value={stats?.cards.totalCitizens}
          color="blue"
          subtitle="Registered users"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          title="Total Schemes"
          value={stats?.cards.totalSchemes}
          color="green"
          subtitle="Active & inactive"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          title="Notifications"
          value={stats?.cards.totalNotifications}
          color="amber"
          subtitle="Published updates"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
        />
        <StatCard
          title="Eligibility Checks"
          value={stats?.cards.totalEligibilityChecks}
          color="purple"
          subtitle="Total searches done"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-900 mb-4">Schemes by Category</h2>
          {stats?.categoryWiseSchemes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.categoryWiseSchemes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {stats.categoryWiseSchemes.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">No scheme data available</div>
          )}
        </div>

        {/* Monthly Registrations */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-900 mb-4">Monthly Registrations</h2>
          {stats?.monthlyRegistrations?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">No registration data available</div>
          )}
        </div>
      </div>

      {/* Eligibility Searches Line Chart */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-slate-900 mb-4">Monthly Eligibility Searches</h2>
        {stats?.monthlyEligibilitySearches?.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyEligibilitySearches}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Searches" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No eligibility search data available</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          // FIX: was '/admin/schemes/add' — absolute path with leading slash skips
          // the AdminRoute auth wrapper and causes a redirect/error.
          // Changed to relative paths so they resolve correctly inside /admin layout.
          { label: 'Add New Scheme',    to: '/admin/schemes/add',        color: 'bg-primary-600', icon: '+' },
          { label: 'Add Notification',  to: '/admin/notifications/add',  color: 'bg-amber-500',   icon: '🔔' },
          { label: 'View Citizens',     to: '/admin/citizens',           color: 'bg-accent-500',  icon: '👥' },
        ].map(({ label, to, color, icon }) => (
          <Link
            key={label}
            to={to}
            className={`${color} text-white rounded-xl p-4 flex items-center gap-3 font-semibold hover:opacity-90 transition-opacity`}
          >
            <span className="text-xl">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;