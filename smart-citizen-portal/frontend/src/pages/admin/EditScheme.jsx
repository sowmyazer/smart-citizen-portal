import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { schemeAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = ['Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'];
const CASTES = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];
const OCCUPATIONS = ['All', 'Farmer', 'Student', 'Self-Employed', 'Government Employee', 'Private Employee', 'Unemployed', 'Business', 'Other'];

const EditScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedCastes, setSelectedCastes] = useState(['All']);
  const [selectedOccupations, setSelectedOccupations] = useState(['All']);
  const [documents, setDocuments] = useState(['']);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await schemeAPI.getSchemeById(id);
        const s = res.data.data;
        reset({
          schemeName: s.schemeName,
          category: s.category,
          description: s.description,
          eligibilityCriteria: s.eligibilityCriteria,
          benefits: s.benefits,
          minAge: s.minAge,
          maxAge: s.maxAge,
          maxIncome: s.maxIncome,
          applyLink: s.applyLink,
          status: s.status,
        });
        setSelectedCastes(s.eligibleCastes || ['All']);
        setSelectedOccupations(s.eligibleOccupations || ['All']);
        setDocuments(s.requiredDocuments?.length > 0 ? s.requiredDocuments : ['']);
      } catch (err) {
        toast.error('Failed to load scheme');
        navigate('/admin/schemes');
      } finally {
        setFetching(false);
      }
    };
    fetchScheme();
  }, [id]);

  const toggleCaste = (c) => {
    setSelectedCastes((prev) =>
      c === 'All' ? ['All'] :
      prev.includes(c) ? prev.filter((x) => x !== c && x !== 'All') :
      [...prev.filter((x) => x !== 'All'), c]
    );
  };

  const toggleOccupation = (o) => {
    setSelectedOccupations((prev) =>
      o === 'All' ? ['All'] :
      prev.includes(o) ? prev.filter((x) => x !== o && x !== 'All') :
      [...prev.filter((x) => x !== 'All'), o]
    );
  };

  const addDoc = () => setDocuments([...documents, '']);
  const removeDoc = (i) => setDocuments(documents.filter((_, idx) => idx !== i));
  const updateDoc = (i, val) => { const u = [...documents]; u[i] = val; setDocuments(u); };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        eligibleCastes: selectedCastes,
        eligibleOccupations: selectedOccupations,
        requiredDocuments: documents.filter(Boolean),
        minAge: Number(data.minAge),
        maxAge: Number(data.maxAge),
        maxIncome: Number(data.maxIncome),
      };
      await schemeAPI.updateScheme(id, payload);
      toast.success('Scheme updated successfully!');
      navigate('/admin/schemes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/schemes" className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Edit Scheme</h1>
          <p className="text-slate-500 text-sm">Update scheme details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Basic Information</h2>
          <div>
            <label className="label">Scheme Name *</label>
            <input {...register('schemeName', { required: 'Required' })} className={`input-field ${errors.schemeName ? 'input-error' : ''}`} />
            {errors.schemeName && <p className="text-red-500 text-xs mt-1">{errors.schemeName.message}</p>}
          </div>
          <div>
            <label className="label">Category *</label>
            <select {...register('category', { required: 'Required' })} className={`input-field ${errors.category ? 'input-error' : ''}`}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea {...register('description', { required: 'Required' })} className={`input-field min-h-[80px] resize-none ${errors.description ? 'input-error' : ''}`} />
          </div>
          <div>
            <label className="label">Eligibility Criteria *</label>
            <textarea {...register('eligibilityCriteria', { required: 'Required' })} className={`input-field min-h-[80px] resize-none ${errors.eligibilityCriteria ? 'input-error' : ''}`} />
          </div>
          <div>
            <label className="label">Benefits *</label>
            <textarea {...register('benefits', { required: 'Required' })} className={`input-field min-h-[80px] resize-none ${errors.benefits ? 'input-error' : ''}`} />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Eligibility Parameters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Min Age</label>
              <input type="number" {...register('minAge')} className="input-field" />
            </div>
            <div>
              <label className="label">Max Age</label>
              <input type="number" {...register('maxAge')} className="input-field" />
            </div>
            <div>
              <label className="label">Max Income (₹)</label>
              <input type="number" {...register('maxIncome')} className="input-field" />
            </div>
          </div>

          <div>
            <label className="label">Eligible Castes</label>
            <div className="flex flex-wrap gap-2">
              {CASTES.map((c) => (
                <button key={c} type="button" onClick={() => toggleCaste(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedCastes.includes(c) ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 text-slate-600 hover:border-primary-400'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Eligible Occupations</label>
            <div className="flex flex-wrap gap-2">
              {OCCUPATIONS.map((o) => (
                <button key={o} type="button" onClick={() => toggleOccupation(o)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedOccupations.includes(o) ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 text-slate-600 hover:border-primary-400'
                  }`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Documents & Apply Link</h2>
          <div>
            <label className="label">Required Documents</label>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={doc} onChange={(e) => updateDoc(i, e.target.value)} className="input-field flex-1" placeholder="e.g., Aadhaar Card" />
                  {documents.length > 1 && (
                    <button type="button" onClick={() => removeDoc(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addDoc} className="text-primary-600 text-sm font-medium hover:underline">+ Add document</button>
            </div>
          </div>
          <div>
            <label className="label">Apply Link</label>
            <input {...register('applyLink')} className="input-field" />
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input-field w-40">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/schemes" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : 'Update Scheme'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScheme;
