import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold text-white mb-4">About Smart Citizen Portal</h1>
            <p className="text-slate-400 text-lg">A Digital India initiative to bridge the gap between citizens and government welfare schemes.</p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The Smart Citizen Government Scheme Eligibility Portal is designed to empower every Indian citizen by providing them with easy access to information about government welfare schemes they are eligible for.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We leverage technology to eliminate the complexity of navigating through hundreds of government schemes, making the process transparent, accessible, and efficient.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered eligibility matching' },
                  { icon: '🔒', title: 'Secure', desc: 'Your data is protected' },
                  { icon: '📱', title: 'Mobile Ready', desc: 'Works on all devices' },
                  { icon: '🆓', title: 'Free Forever', desc: 'No charges to citizens' },
                ].map((item) => (
                  <div key={item.title} className="card p-4">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-slate-900 text-center mb-10">Key Features</h2>
            <div className="space-y-4">
              {[
                { title: 'Eligibility Checker', desc: 'Enter your details once and instantly see all schemes you qualify for across education, agriculture, health, housing, and more.' },
                { title: 'Scheme Database', desc: 'Access a comprehensive database of central and state government schemes, updated regularly by Sachivalayam/Panchayat staff.' },
                { title: 'Real-time Notifications', desc: 'Stay informed about new schemes, application deadlines, and important government announcements.' },
                { title: 'Application Guidance', desc: 'Get direct links to apply for schemes and a list of documents required for each scheme.' },
                { title: 'Admin Dashboard', desc: 'Sachivalayam staff can manage schemes, citizens, and notifications from a centralized admin panel.' },
              ].map((feature) => (
                <div key={feature.title} className="card p-5 flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
