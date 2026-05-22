import { Search } from 'lucide-react'

function SearchFilterBar({ placeholder = 'Cari...', filters = [] }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex gap-3 flex-col md:flex-row">
        <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-400 transition-all duration-150">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            className="outline-none text-sm bg-transparent w-full text-slate-700 placeholder:text-slate-400"
            placeholder={placeholder}
          />
        </div>
        {filters.length > 0 && (
          <div className="flex gap-3">
            {filters.map(f => (
              <select
                key={f.name}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
              >
                {f.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchFilterBar
