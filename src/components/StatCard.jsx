function StatCard({ label, value, delta, deltaColor = 'text-slate-400', icon: Icon, iconBg = 'bg-sky-100', iconColor = 'text-sky-600', cardBg = 'bg-white', onClick }) {
  return (
    <div
      className={`${cardBg} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-2xl font-extrabold text-slate-800">{value}</div>
          <div className="text-xs text-slate-400 mt-0.5">{label}</div>
        </div>
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      {delta && <div className={`text-xs font-semibold ${deltaColor}`}>{delta}</div>}
    </div>
  )
}

export default StatCard
