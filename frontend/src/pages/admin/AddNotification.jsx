import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { notificationAPI } from '../../services/api';

const CATEGORIES = ['General', 'Scheme Update', 'Alert', 'Event', 'Deadline'];

const AddNotification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { category: 'General' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await notificationAPI.createNotification(data);
      toast.success('Notification created successfully!');
      navigate('/admin/notifications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/notifications" className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Add Notification</h1>
          <p className="text-slate-500 text-sm">Create a new public notification</p>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Notification Title *</label>
            <input
              {...register('title', { required: 'Title is required', maxLength: { value: 200, message: 'Max 200 chars' } })}
              className={`input-field ${errors.title ? 'input-error' : ''}`}
              placeholder="Enter notification title"
            />
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
            <textarea
              {...register('description', { required: 'Description is required' })}
              className={`input-field min-h-[140px] resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Enter the full notification content..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="pt-2 flex gap-3">
            <Link to="/admin/notifications" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing...</>
                : 'Publish Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotification;
