import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const categories = [
  { name: 'Education', icon: '🎓', color: 'bg-blue-50 text-blue-700' },
  { name: 'Agriculture', icon: '🌾', color: 'bg-green-50 text-green-700' },
  { name: 'Housing', icon: '🏠', color: 'bg-orange-50 text-orange-700' },
  { name: 'Health', icon: '🏥', color: 'bg-red-50 text-red-700' },
  { name: 'Women Welfare', icon: '👩', color: 'bg-pink-50 text-pink-700' },
  { name: 'Senior Citizen', icon: '👴', color: 'bg-purple-50 text-purple-700' },
  { name: 'Employment', icon: '💼', color: 'bg-indigo-50 text-indigo-700' },
  { name: 'Disability Welfare', icon: '♿', color: 'bg-yellow-50 text-yellow-700' },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Create your account with basic details' },
  { step: '02', title: 'Enter Details', desc: 'Provide income, caste, and occupation' },
  { step: '03', title: 'Check Eligibility', desc: 'System auto-matches you to schemes' },
  { step: '04', title: 'Apply', desc: 'Apply directly to eligible schemes' },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-secondary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-600/30 text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            Digital India Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Find Government Schemes
            <span className="block text-primary-400">You Deserve</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Instantly discover all central and state government welfare schemes you are eligible for. Powered by smart eligibility matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Check Eligibility Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all border border-white/20"
            >
              Browse Schemes
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-10 border-t border-slate-800">
            {[
              { value: '500+', label: 'Schemes' },
              { value: '10L+', label: 'Citizens Helped' },
              { value: '8', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold font-display text-primary-400">{stat.value}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900">Scheme Categories</h2>
            <p className="text-slate-500 mt-2">Government welfare schemes across all sectors</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/schemes?category=${cat.name}`}
                className={`${cat.color} rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-current/20`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-semibold text-sm text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">4 simple steps to find your eligible schemes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-display font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-300 text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to find your eligible schemes?
          </h2>
          <p className="text-primary-100 mb-8">Register for free and check your eligibility in minutes.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
