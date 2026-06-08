import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const categoryColors = {
  General: 'bg-slate-100 text-slate-700',
  'Scheme Update': 'bg-blue-100 text-blue-700',
  Alert: 'bg-red-100 text-red-700',
  Event: 'bg-purple-100 text-purple-700',
  Deadline: 'bg-orange-100 text-orange-700',
};

const categoryIcons = {
  General: '📢',
  'Scheme Update': '📋',
  Alert: '⚠️',
  Event: '🎯',
  Deadline: '⏰',
};

const CitizenNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'General', 'Scheme Update', 'Alert', 'Event', 'Deadline'];

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await notificationAPI.getNotifications(params);
      setNotifications(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, selectedCategory]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Stay updated with the latest government announcements</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-slate-700">No notifications found</h3>
          <p className="text-slate-500 text-sm mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif._id} className="card p-5 hover:shadow-card-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{categoryIcons[notif.category] || '📢'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900">{notif.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[notif.category] || categoryColors.General}`}>
                      {notif.category}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{notif.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>Posted by: {notif.createdBy?.name || 'Admin'}</span>
                    <span>•</span>
                    <span>{new Date(notif.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default CitizenNotifications;
