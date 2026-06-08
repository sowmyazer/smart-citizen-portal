const Badge = ({ label, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    pink: 'bg-pink-100 text-pink-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.gray}`}>
      {label}
    </span>
  );
};

export const getCategoryColor = (category) => {
  const map = {
    'Education': 'blue',
    'Agriculture': 'green',
    'Housing': 'orange',
    'Health': 'red',
    'Women Welfare': 'pink',
    'Senior Citizen': 'purple',
    'Employment': 'indigo',
    'Disability Welfare': 'yellow',
  };
  return map[category] || 'gray';
};

export default Badge;
