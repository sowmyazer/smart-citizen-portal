import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      age: user?.age || '',
      gender: user?.gender || '',
      caste: user?.caste || '',
      occupation: user?.occupation || '',
      annualIncome: user?.annualIncome || '',
      village: user?.village || '',
      district: user?.district || '',
      state: user?.state || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await userAPI.updateProfile(data);
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setEditMode(false);
  };

  const profileFields = [
    { label: 'Full Name', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Mobile', value: user?.mobile || '—' },
    { label: 'Age', value: user?.age ? `${user.age} years` : '—' },
    { label: 'Gender', value: user?.gender || '—' },
    { label: 'Caste Category', value: user?.caste || '—' },
    { label: 'Occupation', value: user?.occupation || '—' },
    { label: 'Annual Income', value: user?.annualIncome ? `₹${user.annualIncome.toLocaleString()}` : '—' },
    { label: 'Village/Town', value: user?.village || '—' },
    { label: 'District', value: user?.district || '—' },
    { label: 'State', value: user?.state || '—' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
        </div>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center">
            <span className="text-accent-700 text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-700 mt-1">
              Citizen
            </span>
          </div>
        </div>

        {!editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileFields.map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-slate-900 font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm">Edit Your Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input {...register('name', { required: 'Required' })} className={`input-field ${errors.name ? 'input-error' : ''}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Mobile</label>
                <input {...register('mobile', { pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })} className={`input-field ${errors.mobile ? 'input-error' : ''}`} />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
              </div>
              <div>
                <label className="label">Age</label>
                <input type="number" {...register('age', { min: 1, max: 120 })} className="input-field" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select {...register('gender')} className="input-field">
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Caste Category</label>
                <select {...register('caste')} className="input-field">
                  <option value="">Select</option>
                  <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                </select>
              </div>
              <div>
                <label className="label">Occupation</label>
                <select {...register('occupation')} className="input-field">
                  <option value="">Select</option>
                  <option>Farmer</option><option>Student</option><option>Self-Employed</option>
                  <option>Government Employee</option><option>Private Employee</option>
                  <option>Unemployed</option><option>Business</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Annual Income (₹)</label>
                <input type="number" {...register('annualIncome', { min: 0 })} className="input-field" />
              </div>
              <div>
                <label className="label">Village/Town</label>
                <input {...register('village')} className="input-field" />
              </div>
              <div>
                <label className="label">District</label>
                <input {...register('district')} className="input-field" />
              </div>
              <div>
                <label className="label">State</label>
                <input {...register('state')} className="input-field" />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Change Password (optional)</h3>
              <input
                type="password"
                {...register('password', { minLength: { value: 6, message: 'Min 6 chars' } })}
                className={`input-field max-w-sm ${errors.password ? 'input-error' : ''}`}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
