import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eligibilityAPI, notificationAPI, schemeAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Badge, { getCategoryColor } from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// ─── helpers ──────────────────────────────────────────────────────────────────

const NOTIFICATION_ICONS = {
  General: '📢',
  'Scheme Update': '📋',
  Alert: '⚠️',
  Event: '🎯',
  Deadline: '⏰',
};

const NOTIFICATION_COLORS = {
  General: 'bg-slate-100 text-slate-600',
  'Scheme Update': 'bg-blue-100 text-blue-700',
  Alert: 'bg-red-100 text-red-700',
  Event: 'bg-purple-100 text-purple-700',
  Deadline: 'bg-orange-100 text-orange-700',
};

const CATEGORY_BG = {
  Education: 'bg-blue-50 border-blue-100',
  Agriculture: 'bg-green-50 border-green-100',
  Housing: 'bg-orange-50 border-orange-100',
  Health: 'bg-red-50 border-red-100',
  'Women Welfare': 'bg-pink-50 border-pink-100',
  'Senior Citizen': 'bg-purple-50 border-purple-100',
  Employment: 'bg-indigo-50 border-indigo-100',
  'Disability Welfare': 'bg-yellow-50 border-yellow-100',
};

/** Client-side eligibility filter — mirrors server logic */
const matchesProfile = (scheme, user) => {
  if (!user?.age || !user?.caste || !user?.occupation) return false;
  const age = Number(user.age);
  const income = Number(user.annualIncome ?? 0);
  if (age < scheme.minAge || age > scheme.maxAge) return false;
  if (income > scheme.maxIncome) return false;
  const casteOk =
    scheme.eligibleCastes?.includes('All') ||
    scheme.eligibleCastes?.includes(user.caste);
  if (!casteOk) return false;
  const occOk =
    scheme.eligibleOccupations?.includes('All') ||
    scheme.eligibleOccupations?.includes(user.occupation);
  if (!occOk) return false;
  return true;
};

// ─── Scheme Detail Modal ───────────────────────────────────────────────────────

const SchemeModal = ({ scheme, onClose }) => {
  if (!scheme) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-3 rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <Badge
              label={scheme.category}
              color={getCategoryColor(scheme.category)}
            />
            <h2 className="font-display font-bold text-slate-900 text-base mt-1.5 leading-snug">
              {scheme.schemeName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Description
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">{scheme.description}</p>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1.5">
              Benefits
            </p>
            <p className="text-green-700 text-sm leading-relaxed">{scheme.benefits}</p>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1.5">
              Eligibility Criteria
            </p>
            <p className="text-blue-700 text-sm leading-relaxed">{scheme.eligibilityCriteria}</p>
          </div>

          {/* Parameters grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Age Range', value: `${scheme.minAge} – ${scheme.maxAge} yrs` },
              {
                label: 'Max Income',
                value: `₹${Number(scheme.maxIncome).toLocaleString('en-IN')}/yr`,
              },
              { label: 'Eligible Castes', value: scheme.eligibleCastes?.join(', ') || '—' },
              {
                label: 'Eligible Occupations',
                value: scheme.eligibleOccupations?.join(', ') || '—',
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-slate-800 text-xs font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Required Documents */}
          {scheme.requiredDocuments?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Required Documents
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scheme.requiredDocuments.map((doc, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {scheme.applyLink ? (
            <a
              href={scheme.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
            >
              Apply Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <div className="flex-1 py-2.5 bg-slate-100 text-slate-500 text-sm font-medium rounded-xl text-center">
              Contact local Panchayat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Scheme Card ──────────────────────────────────────────────────────────────

const SchemeCard = ({ scheme, onViewDetails, isRecommended = false }) => {
  const catBg = CATEGORY_BG[scheme.category] || 'bg-slate-50 border-slate-100';
  return (
    <div className="card flex flex-col hover:shadow-card-lg transition-shadow duration-200 group overflow-hidden">
      {/* Coloured top strip */}
      <div className={`h-1.5 w-full ${catBg.split(' ')[0].replace('bg-', 'bg-').replace('50', '400')}`} />

      <div className="p-4 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge label={scheme.category} color={getCategoryColor(scheme.category)} />
          {isRecommended && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-50 text-accent-700 border border-accent-100">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recommended
            </span>
          )}
        </div>

        {/* Scheme name */}
        <h3 className="font-display font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {scheme.schemeName}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
          {scheme.description}
        </p>

        {/* Benefits snippet */}
        <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4">
          <p className="text-xs font-semibold text-green-700 mb-0.5">Benefits</p>
          <p className="text-xs text-green-600 line-clamp-2">{scheme.benefits}</p>
        </div>

        {/* Params row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {scheme.minAge}–{scheme.maxAge} yrs
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ₹{Number(scheme.maxIncome).toLocaleString('en-IN')}
          </span>
        </div>

        {/* View Details CTA */}
        <button
          onClick={() => onViewDetails(scheme)}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 border border-primary-200 text-primary-700 text-xs font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const CitizenDashboard = () => {
  const { user } = useAuth();

  const [history, setHistory]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allSchemes, setAllSchemes]     = useState([]);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Pagination for Available Schemes section
  const [schemePage, setSchemePage]         = useState(1);
  const [schemeCategory, setSchemeCategory] = useState('All');
  const SCHEMES_PER_PAGE = 6;

  const CATEGORIES = ['All', 'Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'];

  // ── fetch dashboard data ──
  useEffect(() => {
    const fetchCore = async () => {
      try {
        const [histRes, notifRes] = await Promise.all([
          eligibilityAPI.getHistory(),
          notificationAPI.getNotifications({ limit: 5 }),
        ]);
        setHistory(histRes.data.data);
        setNotifications(notifRes.data.data);
      } catch (err) {
        console.error('Dashboard core fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCore();
  }, []);

  // ── fetch all active schemes (for Available + Recommended) ──
  useEffect(() => {
    const fetchSchemes = async () => {
      setSchemesLoading(true);
      try {
        const res = await schemeAPI.getActiveSchemes();
        const schemes = res.data.data || [];
        setAllSchemes(schemes);
        setTotalSchemes(schemes.length);
      } catch (err) {
        console.error('Schemes fetch error:', err);
      } finally {
        setSchemesLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  // ── recommended schemes (client-side filter) ──
  const recommendedSchemes = useMemo(() => {
    if (!allSchemes.length) return [];
    return allSchemes.filter((s) => matchesProfile(s, user)).slice(0, 6);
  }, [allSchemes, user]);

  // ── available schemes with category filter + pagination ──
  const filteredSchemes = useMemo(() => {
    if (schemeCategory === 'All') return allSchemes;
    return allSchemes.filter((s) => s.category === schemeCategory);
  }, [allSchemes, schemeCategory]);

  const totalPages   = Math.ceil(filteredSchemes.length / SCHEMES_PER_PAGE);
  const pagedSchemes = filteredSchemes.slice(
    (schemePage - 1) * SCHEMES_PER_PAGE,
    schemePage * SCHEMES_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setSchemeCategory(cat);
    setSchemePage(1);
  };

  const lastCheck          = history[0];
  const isProfileComplete  = !!(user?.age && user?.caste && user?.occupation);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Welcome, {user?.name}! 👋</h1>
            <p className="text-primary-200 mt-1 text-sm">
              Check your eligibility for government welfare schemes
            </p>
          </div>
          <Link
            to="/citizen/eligibility"
            className="bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check Eligibility
          </Link>
        </div>
      </div>

      {/* ── Profile Completeness Alert ────────────────────────────────────── */}
      {!isProfileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Complete your profile for better recommendations</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Add your age, caste, occupation and income to unlock personalised scheme recommendations.{' '}
              <Link to="/citizen/profile" className="underline font-medium">Update now →</Link>
            </p>
          </div>
        </div>
      )}

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Eligibility Checks"
          value={history.length}
          color="blue"
          subtitle="Total checks done"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Last Check Schemes"
          value={lastCheck?.totalMatched ?? 0}
          color="green"
          subtitle="Schemes matched last time"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Total Active Schemes"
          value={totalSchemes}
          color="purple"
          subtitle="Available government schemes"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* ── Profile + Latest Notifications (2-col) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile Summary */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900">My Profile</h2>
            <Link to="/citizen/profile" className="text-primary-600 text-sm font-medium hover:underline">
              Edit
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-accent-700 text-2xl font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-slate-900">{user?.name}</div>
              <div className="text-slate-500 text-sm">{user?.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-sm">
            {[
              { label: 'Age', value: user?.age ? `${user.age} years` : '—' },
              { label: 'Gender', value: user?.gender || '—' },
              { label: 'Caste', value: user?.caste || '—' },
              { label: 'Occupation', value: user?.occupation || '—' },
              { label: 'Annual Income', value: user?.annualIncome ? `₹${Number(user.annualIncome).toLocaleString('en-IN')}` : '—' },
              { label: 'District', value: user?.district || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-slate-400 text-xs">{label}</p>
                <p className="font-semibold text-slate-800 mt-0.5 truncate text-xs">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Notifications */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900">Latest Notifications</h2>
            <Link to="/citizen/notifications" className="text-primary-600 text-sm font-medium hover:underline">
              View all
            </Link>
          </div>

          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
              <p className="text-slate-400 text-xs mt-1">Check back later for government updates</p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-default"
                >
                  {/* Category icon pill */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${NOTIFICATION_COLORS[n.category] || NOTIFICATION_COLORS.General}`}>
                    {NOTIFICATION_ICONS[n.category] || '📢'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 text-xs leading-snug line-clamp-1">
                        {n.title}
                      </p>
                      <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium ${NOTIFICATION_COLORS[n.category] || NOTIFICATION_COLORS.General}`}>
                        {n.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                      {n.description}
                    </p>
                    <p className="text-slate-400 text-xs mt-1.5">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recommended Schemes ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-accent-100 rounded-lg flex items-center justify-center text-sm">⭐</span>
              Recommended for You
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {isProfileComplete
                ? `${recommendedSchemes.length} scheme${recommendedSchemes.length !== 1 ? 's' : ''} matched to your profile`
                : 'Complete your profile to see personalised recommendations'}
            </p>
          </div>
          <Link
            to="/citizen/eligibility"
            className="btn-accent text-sm hidden sm:flex"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Full Check
          </Link>
        </div>

        {schemesLoading ? (
          <div className="card p-8"><LoadingSpinner /></div>
        ) : !isProfileComplete ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              👤
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Profile incomplete</h3>
            <p className="text-slate-500 text-sm mb-4">
              We need your age, caste, occupation and income to recommend schemes tailored to you.
            </p>
            <Link to="/citizen/profile" className="btn-primary inline-flex text-sm">
              Complete Profile
            </Link>
          </div>
        ) : recommendedSchemes.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-slate-800 mb-1">No exact matches found</h3>
            <p className="text-slate-500 text-sm mb-4">
              None of the current active schemes exactly match your profile criteria.
              Browse all schemes to explore what's available.
            </p>
            <Link to="/citizen/eligibility" className="btn-primary inline-flex text-sm">
              Run Full Eligibility Check
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme._id}
                scheme={scheme}
                isRecommended
                onViewDetails={setSelectedScheme}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Available Schemes ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center text-sm">📋</span>
              Available Schemes
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {filteredSchemes.length} active scheme{filteredSchemes.length !== 1 ? 's' : ''}
              {schemeCategory !== 'All' ? ` in ${schemeCategory}` : ' across all categories'}
            </p>
          </div>
          <Link to="/schemes" className="btn-secondary text-sm hidden sm:flex">
            Browse All
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                schemeCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {schemesLoading ? (
          <div className="card p-8"><LoadingSpinner /></div>
        ) : pagedSchemes.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="font-bold text-slate-700">No schemes in this category</h3>
            <p className="text-slate-400 text-sm mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pagedSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme._id}
                  scheme={scheme}
                  isRecommended={isProfileComplete && matchesProfile(scheme, user)}
                  onViewDetails={setSelectedScheme}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Page {schemePage} of {totalPages} &nbsp;·&nbsp;
                  {filteredSchemes.length} schemes
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSchemePage((p) => Math.max(1, p - 1))}
                    disabled={schemePage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = totalPages <= 5
                      ? i + 1
                      : schemePage <= 3
                        ? i + 1
                        : schemePage >= totalPages - 2
                          ? totalPages - 4 + i
                          : schemePage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setSchemePage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === schemePage
                            ? 'bg-primary-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setSchemePage((p) => Math.min(totalPages, p + 1))}
                    disabled={schemePage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Eligibility History ───────────────────────────────────────────── */}
      {history.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🕑</span>
              Recent Eligibility Checks
            </h2>
            <Link to="/citizen/eligibility" className="text-primary-600 text-sm font-medium hover:underline">
              Check again
            </Link>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Age</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Annual Income</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Caste</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Occupation</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase tracking-wide">Matched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.slice(0, 5).map((h) => (
                    <tr key={h._id} className="table-row">
                      <td className="px-4 py-3 text-slate-700">
                        {new Date(h.checkedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{h.inputData?.age} yrs</td>
                      <td className="px-4 py-3 text-slate-700">
                        ₹{Number(h.inputData?.annualIncome).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{h.inputData?.caste || '—'}</td>
                      <td className="px-4 py-3 text-slate-700">{h.inputData?.occupation || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            h.totalMatched > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {h.totalMatched > 0 && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {h.totalMatched} scheme{h.totalMatched !== 1 ? 's' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Scheme Detail Modal ───────────────────────────────────────────── */}
      <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
};

export default CitizenDashboard;