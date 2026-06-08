import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { notificationAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = ['General', 'Scheme Update', 'Alert', 'Event', 'Deadline'];

const EditNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await notificationAPI.getNotificationById(id);
        const n = res.data.data;
        reset({ title: n.title, description: n.description, category: n.category, isActive: n.isActive });
      } catch {
        toast.error('Failed to load notification');
        navigate('/admin/notifications');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await notificationAPI.updateNotification(id, data);
      toast.success('Notification updated successfully!');
      navigate('/admin/notifications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/notifications" className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Edit Notification</h1>
          <p className="text-slate-500 text-sm">Update notification details</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Required' })} className={`input-field ${errors.title ? 'input-error' : ''}`} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Category</label>
            <select {...register('category')} className="input-field">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea {...register('description', { required: 'Required' })} className={`input-field min-h-[140px] resize-none ${errors.description ? 'input-error' : ''}`} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 text-primary-600 rounded" />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active (visible to citizens)</label>
          </div>
          <div className="pt-2 flex gap-3">
            <Link to="/admin/notifications" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : 'Update Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotification;
