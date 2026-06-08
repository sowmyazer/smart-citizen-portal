import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm();

  const nextStep = async () => {
    const fields = step === 1
      ? ['name', 'email', 'password', 'mobile']
      : ['age', 'gender', 'caste', 'occupation', 'annualIncome'];
    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register(data);
      login(res.data.data);
      toast.success('Registration successful! Welcome!');
      navigate('/citizen/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <span className="font-display font-bold text-slate-900">Smart Citizen Portal</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Register to check your scheme eligibility</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-20 text-xs text-slate-500 mb-8 -mt-4">
          <span>Account Info</span>
          <span>Personal Info</span>
          <span>Location</span>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 mb-4">Account Information</h2>
                <div>
                  <label className="label">Full Name *</label>
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                    className={`input-field ${errors.name ? 'input-error' : ''}`} placeholder="Enter your full name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input type="email" {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    className={`input-field ${errors.email ? 'input-error' : ''}`} placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Password *</label>
                  <input type="password" {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    className={`input-field ${errors.password ? 'input-error' : ''}`} placeholder="Minimum 6 characters" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="label">Mobile Number</label>
                  <input {...register('mobile', { pattern: { value: /^[0-9]{10}$/, message: '10-digit number' } })}
                    className={`input-field ${errors.mobile ? 'input-error' : ''}`} placeholder="10-digit mobile number" />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
                <button type="button" onClick={nextStep} className="w-full btn-primary justify-center">Next →</button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Age *</label>
                    <input type="number" {...register('age', { required: 'Age required', min: { value: 1, message: 'Min 1' }, max: { value: 120, message: 'Max 120' } })}
                      className={`input-field ${errors.age ? 'input-error' : ''}`} placeholder="Age" />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                  </div>
                  <div>
                    <label className="label">Gender *</label>
                    <select {...register('gender', { required: 'Required' })} className={`input-field ${errors.gender ? 'input-error' : ''}`}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Caste Category *</label>
                    <select {...register('caste', { required: 'Required' })} className={`input-field ${errors.caste ? 'input-error' : ''}`}>
                      <option value="">Select</option>
                      <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                    </select>
                    {errors.caste && <p className="text-red-500 text-xs mt-1">{errors.caste.message}</p>}
                  </div>
                  <div>
                    <label className="label">Occupation *</label>
                    <select {...register('occupation', { required: 'Required' })} className={`input-field ${errors.occupation ? 'input-error' : ''}`}>
                      <option value="">Select</option>
                      <option>Farmer</option><option>Student</option><option>Self-Employed</option>
                      <option>Government Employee</option><option>Private Employee</option>
                      <option>Unemployed</option><option>Business</option><option>Other</option>
                    </select>
                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Annual Income (₹)</label>
                  <input type="number" {...register('annualIncome', { min: { value: 0, message: 'Must be positive' } })}
                    className={`input-field ${errors.annualIncome ? 'input-error' : ''}`} placeholder="Annual income in rupees" />
                  {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome.message}</p>}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary justify-center">← Back</button>
                  <button type="button" onClick={nextStep} className="flex-1 btn-primary justify-center">Next →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-bold text-slate-900 mb-4">Location Details</h2>
                <div>
                  <label className="label">Village/Town</label>
                  <input {...register('village')} className="input-field" placeholder="Village or Town name" />
                </div>
                <div>
                  <label className="label">District</label>
                  <input {...register('district')} className="input-field" placeholder="Your district" />
                </div>
                <div>
                  <label className="label">State</label>
                  <input {...register('state')} className="input-field" placeholder="Your state" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary justify-center">← Back</button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering...</> : 'Register'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
