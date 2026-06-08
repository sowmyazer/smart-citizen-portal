import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { eligibilityAPI } from '../../services/api';

const EligibilityChecker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      age: user?.age || '',
      gender: user?.gender || '',
      caste: user?.caste || '',
      occupation: user?.occupation || '',
      annualIncome: user?.annualIncome || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        age: Number(data.age),
        gender: data.gender,
        caste: data.caste,
        occupation: data.occupation,
        annualIncome: Number(data.annualIncome),
      };
      const res = await eligibilityAPI.checkEligibility(payload);
      toast.success(`Found ${res.data.data.totalMatched} eligible schemes!`);
      navigate('/citizen/eligibility/results', { state: { results: res.data.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Eligibility check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Eligibility Checker</h1>
        <p className="text-slate-500 text-sm mt-1">Enter your details to find all government schemes you qualify for</p>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-primary-700">
          Your profile details have been pre-filled. Adjust if needed and click <strong>Check Eligibility</strong> to see matching schemes.
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div>
              <label className="label">Age *</label>
              <input
                type="number"
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 1, message: 'Min age is 1' },
                  max: { value: 120, message: 'Max age is 120' },
                })}
                className={`input-field ${errors.age ? 'input-error' : ''}`}
                placeholder="Your age in years"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="label">Gender</label>
              <select {...register('gender')} className="input-field">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Caste */}
            <div>
              <label className="label">Caste Category *</label>
              <select
                {...register('caste', { required: 'Caste is required' })}
                className={`input-field ${errors.caste ? 'input-error' : ''}`}
              >
                <option value="">Select caste</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
              {errors.caste && <p className="text-red-500 text-xs mt-1">{errors.caste.message}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="label">Occupation *</label>
              <select
                {...register('occupation', { required: 'Occupation is required' })}
                className={`input-field ${errors.occupation ? 'input-error' : ''}`}
              >
                <option value="">Select occupation</option>
                <option>Farmer</option>
                <option>Student</option>
                <option>Self-Employed</option>
                <option>Government Employee</option>
                <option>Private Employee</option>
                <option>Unemployed</option>
                <option>Business</option>
                <option>Other</option>
              </select>
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
            </div>

            {/* Annual Income */}
            <div className="sm:col-span-2">
              <label className="label">Annual Income (₹) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  {...register('annualIncome', {
                    required: 'Annual income is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                  className={`input-field pl-7 ${errors.annualIncome ? 'input-error' : ''}`}
                  placeholder="Annual income in rupees"
                />
              </div>
              {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking eligibility...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Check Eligibility
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* How matching works */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-3">How Eligibility Matching Works</h3>
        <div className="space-y-2.5">
          {[
            { icon: '🎂', text: 'Age is matched against scheme age limits' },
            { icon: '💰', text: 'Annual income is checked against maximum income criteria' },
            { icon: '🏷️', text: 'Caste category is matched against eligible castes for each scheme' },
            { icon: '💼', text: 'Occupation is checked against eligible occupations' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
              <span className="text-lg">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
