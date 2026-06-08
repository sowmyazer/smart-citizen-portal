const StatCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-600',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-600',
      text: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-600',
      text: 'text-amber-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-600',
      text: 'text-purple-600',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-600',
      text: 'text-red-600',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`${colors.icon} text-white w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold font-display ${colors.text}`}>{value?.toLocaleString() ?? '—'}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
