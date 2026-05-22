function PageHeader({ title, subtitle, badge, badgeIcon: BadgeIcon }) {
  return (
    <div className="bg-linear-to-r from-sky-700 to-sky-400 rounded-xl px-6 py-5">
      {badge && (
        <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white mb-3">
          {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
          {badge}
        </div>
      )}
      <h1 className="text-2xl font-extrabold text-white">{title}</h1>
      {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

export default PageHeader
