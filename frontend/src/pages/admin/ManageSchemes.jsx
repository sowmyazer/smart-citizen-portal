import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { schemeAPI } from '../../services/api';
import Badge, { getCategoryColor } from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'];

const ManageSchemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      const res = await schemeAPI.getSchemes(params);
      setSchemes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchemes(); }, [page, category, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSchemes();
  };

  const handleDelete = async () => {
    try {
      await schemeAPI.deleteScheme(deleteId);
      toast.success('Scheme deleted successfully');
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Manage Schemes</h1>
          <p className="text-slate-500 text-sm mt-1">{pagination.total || 0} total schemes</p>
        </div>
        <Link to="/admin/schemes/add" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Scheme
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-4">Search</button>
          </form>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input-field md:w-48">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input-field md:w-36">
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : schemes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-500">No schemes found</p>
            <Link to="/admin/schemes/add" className="btn-primary mt-4 inline-flex">Add First Scheme</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Scheme Name</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Age Limit</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Max Income</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((scheme, idx) => (
                  <tr key={scheme._id} className="table-row">
                    <td className="px-4 py-3 text-slate-500">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 max-w-xs truncate">{scheme.schemeName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{scheme.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={scheme.category} color={getCategoryColor(scheme.category)} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">{scheme.minAge}–{scheme.maxAge} yrs</td>
                    <td className="px-4 py-3 text-slate-700">₹{scheme.maxIncome?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge label={scheme.status} color={scheme.status === 'Active' ? 'green' : 'red'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/schemes/edit/${scheme._id}`)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(scheme._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        title="Delete Scheme"
        message="Are you sure you want to delete this scheme? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default ManageSchemes;
