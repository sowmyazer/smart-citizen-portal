import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { notificationAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';

const categoryColors = {
  General: 'bg-slate-100 text-slate-700',
  'Scheme Update': 'bg-blue-100 text-blue-700',
  Alert: 'bg-red-100 text-red-700',
  Event: 'bg-purple-100 text-purple-700',
  Deadline: 'bg-orange-100 text-orange-700',
};

const ManageNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await notificationAPI.getAdminNotifications(params);
      setNotifications(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotifications();
  };

  const handleDelete = async () => {
    try {
      await notificationAPI.deleteNotification(deleteId);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Manage Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">{pagination.total || 0} total notifications</p>
        </div>
        <Link to="/admin/notifications/add" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Notification
        </Link>
      </div>

      {/* Search */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-4">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-slate-500">No notifications found</p>
            <Link to="/admin/notifications/add" className="btn-primary mt-4 inline-flex">Add First Notification</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Title</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Created By</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map((notif, idx) => (
                  <tr key={notif._id} className="table-row">
                    <td className="px-4 py-3 text-slate-500">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 max-w-xs truncate">{notif.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{notif.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[notif.category] || categoryColors.General}`}>
                        {notif.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{notif.createdBy?.name || 'Admin'}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notif.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {notif.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/notifications/edit/${notif._id}`)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(notif._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        confirmText="Delete"
      />
    </div>
  );
};

export default ManageNotifications;
