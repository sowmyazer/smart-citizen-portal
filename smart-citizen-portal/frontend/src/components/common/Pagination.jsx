const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pageNumbers.push(i);
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            num === page
              ? 'bg-primary-600 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
