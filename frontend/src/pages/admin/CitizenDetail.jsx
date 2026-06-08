import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CitizenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userAPI.getCitizenById(id);
        setCitizen(res.data.data);
      } catch {
        toast.error('Citizen not found');
        navigate('/admin/citizens');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!citizen) return null;

  const fields = [
    { label: 'Full Name', value: citizen.name },
    { label: 'Email', value: citizen.email },
    { label: 'Mobile', value: citizen.mobile || '—' },
    { label: 'Age', value: citizen.age ? `${citizen.age} years` : '—' },
    { label: 'Gender', value: citizen.gender || '—' },
    { label: 'Caste Category', value: citizen.caste || '—' },
    { label: 'Occupation', value: citizen.occupation || '—' },
    { label: 'Annual Income', value: citizen.annualIncome ? `₹${citizen.annualIncome.toLocaleString()}` : '—' },
    { label: 'Village/Town', value: citizen.village || '—' },
    { label: 'District', value: citizen.district || '—' },
    { label: 'State', value: citizen.state || '—' },
    { label: 'Registered On', value: new Date(citizen.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ];

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/citizens" className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Citizen Profile</h1>
          <p className="text-slate-500 text-sm">Detailed view of citizen information</p>
        </div>
      </div>

      <div className="card p-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-200">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
            <span className="text-primary-700 text-2xl font-bold">{citizen.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{citizen.name}</h2>
            <p className="text-slate-500 text-sm">{citizen.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${citizen.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {citizen.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Citizen
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <p className="text-slate-900 font-semibold mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-200">
          <Link to="/admin/citizens" className="btn-secondary">
            ← Back to Citizens
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenDetail;
