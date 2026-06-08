import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { schemeAPI } from '../../services/api';

const CATEGORIES = ['Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'];
const CASTES = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];
const OCCUPATIONS = ['All', 'Farmer', 'Student', 'Self-Employed', 'Government Employee', 'Private Employee', 'Unemployed', 'Business', 'Other'];

const AddScheme = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCastes, setSelectedCastes] = useState(['All']);
  const [selectedOccupations, setSelectedOccupations] = useState(['All']);
  const [documents, setDocuments] = useState(['']);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { minAge: 0, maxAge: 120, maxIncome: 500000, status: 'Active' },
  });

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

  const addDocumentField = () => setDocuments([...documents, '']);
  const removeDocumentField = (i) => setDocuments(documents.filter((_, idx) => idx !== i));
  const updateDocument = (i, val) => {
    const updated = [...documents];
    updated[i] = val;
    setDocuments(updated);
  };

  const onSubmit = async (data) => {
    if (selectedCastes.length === 0) {
      toast.error('Select at least one caste category');
      return;
    }
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
      await schemeAPI.createScheme(payload);
      toast.success('Scheme created successfully!');
      navigate('/admin/schemes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create scheme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/schemes" className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Add New Scheme</h1>
          <p className="text-slate-500 text-sm">Create a new government welfare scheme</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Basic Information</h2>

          <div>
            <label className="label">Scheme Name *</label>
            <input {...register('schemeName', { required: 'Scheme name is required' })}
              className={`input-field ${errors.schemeName ? 'input-error' : ''}`}
              placeholder="Enter scheme name" />
            {errors.schemeName && <p className="text-red-500 text-xs mt-1">{errors.schemeName.message}</p>}
          </div>

          <div>
            <label className="label">Category *</label>
            <select {...register('category', { required: 'Category is required' })}
              className={`input-field ${errors.category ? 'input-error' : ''}`}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea {...register('description', { required: 'Description is required' })}
              className={`input-field min-h-[90px] resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe the scheme..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Eligibility Criteria *</label>
            <textarea {...register('eligibilityCriteria', { required: 'Required' })}
              className={`input-field min-h-[90px] resize-none ${errors.eligibilityCriteria ? 'input-error' : ''}`}
              placeholder="Describe who is eligible..." />
            {errors.eligibilityCriteria && <p className="text-red-500 text-xs mt-1">{errors.eligibilityCriteria.message}</p>}
          </div>

          <div>
            <label className="label">Benefits *</label>
            <textarea {...register('benefits', { required: 'Benefits are required' })}
              className={`input-field min-h-[80px] resize-none ${errors.benefits ? 'input-error' : ''}`}
              placeholder="What benefits does the scheme provide?" />
            {errors.benefits && <p className="text-red-500 text-xs mt-1">{errors.benefits.message}</p>}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Eligibility Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Min Age</label>
              <input type="number" {...register('minAge', { min: 0 })} className="input-field" />
            </div>
            <div>
              <label className="label">Max Age</label>
              <input type="number" {...register('maxAge', { max: 120 })} className="input-field" />
            </div>
            <div>
              <label className="label">Max Annual Income (₹)</label>
              <input type="number" {...register('maxIncome', { min: 0 })} className="input-field" />
            </div>
          </div>

          {/* Caste */}
          <div>
            <label className="label">Eligible Castes *</label>
            <div className="flex flex-wrap gap-2">
              {CASTES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCaste(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedCastes.includes(c)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-primary-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="label">Eligible Occupations *</label>
            <div className="flex flex-wrap gap-2">
              {OCCUPATIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleOccupation(o)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedOccupations.includes(o)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-primary-400'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents & Links */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Documents & Apply Link</h2>

          <div>
            <label className="label">Required Documents</label>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => updateDocument(i, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Document ${i + 1} (e.g., Aadhaar Card)`}
                  />
                  {documents.length > 1 && (
                    <button type="button" onClick={() => removeDocumentField(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addDocumentField} className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add document
              </button>
            </div>
          </div>

          <div>
            <label className="label">Apply Link (URL)</label>
            <input {...register('applyLink')} className="input-field" placeholder="https://example.gov.in/apply" />
          </div>

          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input-field w-40">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/admin/schemes" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Scheme'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScheme;
