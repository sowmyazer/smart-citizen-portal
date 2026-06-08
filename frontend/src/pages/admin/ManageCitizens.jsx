import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';

const ManageCitizens = () => {
  const navigate = useNavigate();
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await userAPI.getAllCitizens(params);
      setCitizens(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load citizens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCitizens(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCitizens();
  };

  const handleDelete = async () => {
    try {
      await userAPI.deleteCitizen(deleteId);
      toast.success('Citizen deleted successfully');
      fetchCitizens();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await userAPI.toggleStatus(id);
      toast.success(res.data.message);
      fetchCitizens();
    } catch {
      toast.error('Status toggle failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Manage Citizens</h1>
          <p className="text-slate-500 text-sm mt-1">{pagination.total || 0} registered citizens</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, mobile, district..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-4">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setPage(1); setTimeout(fetchCitizens, 100); }} className="btn-secondary px-4">
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : citizens.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-slate-500">No citizens found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Contact</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Location</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Income</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {citizens.map((citizen, idx) => (
                  <tr key={citizen._id} className="table-row">
                    <td className="px-4 py-3 text-slate-500">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 text-sm font-bold">{citizen.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{citizen.name}</div>
                          <div className="text-xs text-slate-400">{citizen.age ? `${citizen.age} yrs` : '—'} • {citizen.gender || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{citizen.email}</div>
                      <div className="text-xs text-slate-400">{citizen.mobile || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{citizen.caste || '—'}</div>
                      <div className="text-xs text-slate-400">{citizen.occupation || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{citizen.district || '—'}</div>
                      <div className="text-xs text-slate-400">{citizen.state || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {citizen.annualIncome ? `₹${citizen.annualIncome.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(citizen._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          citizen.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {citizen.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/citizens/${citizen._id}`)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="View Profile"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(citizen._id)}
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
        title="Delete Citizen"
        message="Are you sure you want to delete this citizen? All their data will be permanently removed."
        confirmText="Delete"
      />
    </div>
  );
};

export default ManageCitizens;
