import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-800 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyticsAPI.getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Comprehensive portal statistics and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Citizens"
          value={stats?.cards.totalCitizens}
          color="blue"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>}
        />
        <StatCard
          title="Total Schemes"
          value={stats?.cards.totalSchemes}
          color="green"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          title="Notifications"
          value={stats?.cards.totalNotifications}
          color="amber"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
        />
        <StatCard
          title="Eligibility Checks"
          value={stats?.cards.totalEligibilityChecks}
          color="purple"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie - Category wise */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-900 mb-1">Schemes by Category</h2>
          <p className="text-xs text-slate-500 mb-4">Distribution across welfare categories</p>
          {stats?.categoryWiseSchemes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.categoryWiseSchemes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={95}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {stats.categoryWiseSchemes.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>

        {/* Bar - Monthly Registrations */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-900 mb-1">Monthly Registrations</h2>
          <p className="text-xs text-slate-500 mb-4">New citizen registrations per month</p>
          {stats?.monthlyRegistrations?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.monthlyRegistrations} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Area Chart - Eligibility Searches */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-slate-900 mb-1">Eligibility Search Trends</h2>
        <p className="text-xs text-slate-500 mb-4">Monthly eligibility check activity over last 6 months</p>
        {stats?.monthlyEligibilitySearches?.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.monthlyEligibilitySearches} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} fill="url(#searchGrad)" name="Searches" dot={{ fill: '#10B981', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No eligibility search data available yet</div>
        )}
      </div>

      {/* Comparison Line Chart */}
      {(stats?.monthlyRegistrations?.length > 0 || stats?.monthlyEligibilitySearches?.length > 0) && (
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-900 mb-1">Registrations vs Eligibility Checks</h2>
          <p className="text-xs text-slate-500 mb-4">Comparing citizen registrations and eligibility checks over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line data={stats.monthlyRegistrations} type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} name="Registrations" dot={{ r: 3 }} />
              <Line data={stats.monthlyEligibilitySearches} type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} name="Eligibility Checks" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
