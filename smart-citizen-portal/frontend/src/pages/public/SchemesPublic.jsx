import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge, { getCategoryColor } from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { schemeAPI } from '../../services/api';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Housing', 'Health', 'Women Welfare', 'Senior Citizen', 'Employment', 'Disability Welfare'];

const SchemesPublic = () => {
  const [searchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [expanded, setExpanded] = useState(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, status: 'Active' };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await schemeAPI.getSchemes(params);
      setSchemes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSchemes();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-secondary py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Government Schemes</h1>
            <p className="text-slate-400">Browse all active government welfare schemes</p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search schemes..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b border-slate-200 sticky top-16 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Schemes Grid */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <LoadingSpinner />
            ) : schemes.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-slate-700">No schemes found</h3>
                <p className="text-slate-500 mt-2">Try a different search term or category</p>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm mb-6">{pagination.total} schemes found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {schemes.map((scheme) => (
                    <div key={scheme._id} className="card p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge label={scheme.category} color={getCategoryColor(scheme.category)} />
                        <Badge label={scheme.status} color={scheme.status === 'Active' ? 'green' : 'red'} />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 leading-snug">{scheme.schemeName}</h3>
                      <p className="text-slate-500 text-sm flex-1 mb-4 line-clamp-3">{scheme.description}</p>

                      <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Age Limit:</span>
                          <span className="font-medium">{scheme.minAge} – {scheme.maxAge} yrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Income:</span>
                          <span className="font-medium">₹{scheme.maxIncome?.toLocaleString()}/yr</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Caste:</span>
                          <span className="font-medium">{scheme.eligibleCastes?.join(', ')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpanded(expanded === scheme._id ? null : scheme._id)}
                        className="mt-3 text-primary-600 text-sm font-medium hover:underline text-left"
                      >
                        {expanded === scheme._id ? 'Show less ↑' : 'Show more ↓'}
                      </button>

                      {expanded === scheme._id && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-slate-700">Benefits:</span>
                            <p className="text-xs text-slate-600 mt-1">{scheme.benefits}</p>
                          </div>
                          {scheme.requiredDocuments?.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-slate-700">Documents Required:</span>
                              <ul className="text-xs text-slate-600 mt-1 list-disc pl-4">
                                {scheme.requiredDocuments.map((doc, i) => <li key={i}>{doc}</li>)}
                              </ul>
                            </div>
                          )}
                          {scheme.applyLink && (
                            <a
                              href={scheme.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary-600 font-semibold hover:underline mt-1"
                            >
                              Apply Now →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SchemesPublic;
