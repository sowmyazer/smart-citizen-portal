import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-slate-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-white font-display font-bold text-sm">Smart Citizen Portal</div>
                <div className="text-slate-500 text-xs">Government Scheme Eligibility</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Empowering citizens by connecting them with government welfare schemes they are eligible for. A Digital India initiative.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Schemes</Link></li>
              <li><Link to="/notifications" className="hover:text-white transition-colors">Notifications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li className="text-slate-500">Eligibility Check</li>
              <li className="text-slate-500">Scheme Discovery</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Smart Citizen Portal. Government of India. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with ❤️ for Digital India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
