import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

function DataTable({ columns = [], data = [], pageSize = 10 }) {
  const [page, setPage] = useState(1)

  // reset ke halaman 1 setiap kali data berubah (search/filter)
  useEffect(() => { setPage(1) }, [data])

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const start      = (page - 1) * pageSize
  const pageData   = data.slice(start, start + pageSize)
  const showPager  = data.length > pageSize

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map(col => (
              <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-slate-400">
                Belum ada data
              </td>
            </tr>
          ) : (
            pageData.map((row, i) => (
              <tr key={start + i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-100">
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row, start + i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPager && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Menampilkan {start + 1}–{Math.min(start + pageSize, data.length)} dari {data.length} data
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    page === p
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
