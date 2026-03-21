import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Column<T> {
  key: keyof T & string
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  width?: string
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  searchKeys?: (keyof T & string)[]
  title?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys,
  title,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredData = useMemo(() => {
    let result = [...data]

    // Search filter
    if (search && searchKeys) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(row =>
        searchKeys.some(key => {
          const val = row[key]
          return val != null && String(val).toLowerCase().includes(lowerSearch)
        })
      )
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [data, search, searchKeys, sortKey, sortDir])

  const handleSort = (key: keyof T & string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="w-full">
      {/* Header with search */}
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h2 className="font-mono text-sm tracking-widest uppercase text-white/50">
            {title}
            <span className="ml-2 text-[#BF40BF] text-xs">
              [{filteredData.length}]
            </span>
          </h2>
        )}
        {searchKeys && (
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-white/[0.03] border border-white/10 rounded px-3 py-1.5
                text-xs font-mono text-white/70 placeholder:text-white/20
                focus:outline-none focus:border-[#BF40BF]/30 focus:ring-1 focus:ring-[#BF40BF]/10
                w-48 transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/15 text-[10px] font-mono">
              /
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`
                    px-4 py-3 font-mono text-[10px] tracking-[0.15em] uppercase text-white/30
                    ${col.sortable !== false ? 'cursor-pointer hover:text-white/50 select-none' : ''}
                    ${col.width || ''}
                    transition-colors
                  `}
                >
                  <span className="flex items-center gap-1.5">
                    {col.header}
                    {sortKey === col.key && (
                      <span className="text-[#BF40BF]">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-xs text-white/60 group-hover:text-white/80 transition-colors ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="py-12 text-center font-mono text-xs text-white/20">
            No results found
          </div>
        )}
      </div>
    </div>
  )
}
