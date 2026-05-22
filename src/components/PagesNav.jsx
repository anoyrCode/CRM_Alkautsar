import { NavLink } from 'react-router-dom'

function PagesNav({ to, children, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-sky-100 text-sky-700 font-semibold'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{children}</span>
    </NavLink>
  )
}

export default PagesNav
