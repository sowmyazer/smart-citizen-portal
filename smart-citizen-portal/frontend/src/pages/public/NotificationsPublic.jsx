import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { notificationAPI } from '../../services/api';

const NotificationsPublic = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await notificationAPI.getNotifications({ page, limit: 10 });
        setNotifications(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const categoryColors = {
    General: 'bg-slate-100 text-slate-700',
    'Scheme Update': 'bg-blue-100 text-blue-700',
    Alert: 'bg-red-100 text-red-700',
    Event: 'bg-purple-100 text-purple-700',
    Deadline: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-secondary py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Notifications</h1>
            <p className="text-slate-400">Latest updates from the government</p>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <LoadingSpinner />
            ) : notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-slate-700">No notifications yet</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif._id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[notif.category] || categoryColors.General}`}>
                            {notif.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{notif.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{notif.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>By: {notif.createdBy?.name || 'Admin'}</span>
                      <span>{new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPublic;
