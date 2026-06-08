import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import Badge, { getCategoryColor } from '../../components/common/Badge';

const EligibilityResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    navigate('/citizen/eligibility');
    return null;
  }

  const { matchedSchemes, totalMatched, inputData } = results;

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('Smart Citizen Portal', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Eligibility Check Results', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 38, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Your Details:', 15, 50);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Age: ${inputData.age} yrs | Income: ₹${inputData.annualIncome?.toLocaleString()} | Caste: ${inputData.caste} | Occupation: ${inputData.occupation}`, 15, 58);

    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`✓ ${totalMatched} Eligible Scheme(s) Found`, 15, 70);

    let y = 82;
    matchedSchemes.forEach((scheme, idx) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(`${idx + 1}. ${scheme.schemeName}`, 15, y);
      y += 6;
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Category: ${scheme.category}`, 20, y);
      y += 5;
      const benefitLines = doc.splitTextToSize(`Benefits: ${scheme.benefits}`, pageWidth - 35);
      doc.text(benefitLines, 20, y);
      y += benefitLines.length * 4.5 + 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(15, y, pageWidth - 15, y);
      y += 6;
    });

    doc.save('eligibility-results.pdf');
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate('/citizen/eligibility')}
              className="text-slate-500 hover:text-slate-700"
            >
              ← Back
            </button>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Eligibility Results</h1>
          <p className="text-slate-500 text-sm mt-1">Based on your provided details</p>
        </div>
        <button onClick={downloadPDF} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Input Summary */}
      <div className="card p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Checked with these details:</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Age', value: `${inputData.age} yrs` },
            { label: 'Gender', value: inputData.gender || 'Not specified' },
            { label: 'Caste', value: inputData.caste },
            { label: 'Occupation', value: inputData.occupation },
            { label: 'Income', value: `₹${inputData.annualIncome?.toLocaleString()}/yr` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-slate-500">{label}: </span>
              <span className="font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results Banner */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 ${
        totalMatched > 0 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
      }`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          totalMatched > 0 ? 'bg-green-600' : 'bg-amber-500'
        }`}>
          {totalMatched > 0 ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p className={`text-lg font-display font-bold ${totalMatched > 0 ? 'text-green-800' : 'text-amber-800'}`}>
            {totalMatched > 0
              ? `🎉 You are eligible for ${totalMatched} scheme${totalMatched > 1 ? 's' : ''}!`
              : 'No matching schemes found'}
          </p>
          <p className={`text-sm mt-0.5 ${totalMatched > 0 ? 'text-green-700' : 'text-amber-700'}`}>
            {totalMatched > 0
              ? 'Review the schemes below and apply using the links provided.'
              : 'Try updating your profile details or check back when new schemes are added.'}
          </p>
        </div>
      </div>

      {/* Scheme Cards */}
      {totalMatched > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedSchemes.map((scheme) => (
            <div key={scheme._id} className="card p-5 flex flex-col">
              <div className="flex items-start gap-2 justify-between mb-3">
                <Badge label={scheme.category} color={getCategoryColor(scheme.category)} />
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 mb-2 leading-snug">{scheme.schemeName}</h3>
              <p className="text-slate-500 text-sm flex-1 mb-3 line-clamp-2">{scheme.description}</p>

              {/* Benefits */}
              <div className="bg-green-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-green-800 mb-1">Benefits:</p>
                <p className="text-xs text-green-700 line-clamp-3">{scheme.benefits}</p>
              </div>

              {/* Eligibility Details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Age Range</p>
                  <p className="font-medium">{scheme.minAge}–{scheme.maxAge} yrs</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Max Income</p>
                  <p className="font-medium">₹{scheme.maxIncome?.toLocaleString()}</p>
                </div>
              </div>

              {/* Required Documents */}
              {scheme.requiredDocuments?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">Required Documents:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.requiredDocuments.map((doc, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{doc}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Link */}
              {scheme.applyLink ? (
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  Apply Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="mt-auto w-full bg-slate-100 text-slate-500 text-sm font-medium py-2.5 rounded-lg text-center">
                  Contact local Panchayat to apply
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {totalMatched === 0 && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No schemes matched your profile</h3>
          <p className="text-slate-500 text-sm mb-4">This could be because your income or age exceeds scheme limits, or your caste/occupation isn't covered by current active schemes.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/citizen/eligibility')} className="btn-primary">Try Again</button>
            <Link to="/schemes" className="btn-secondary">Browse All Schemes</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityResults;
