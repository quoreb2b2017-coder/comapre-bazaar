import type { ComparisonTableData } from '@/types'
import { CheckIcon, XIcon } from '@/components/ui/icons'

interface ComparisonTableProps {
  data: ComparisonTableData
  caption?: string
}

export function ComparisonTable({ data, caption }: ComparisonTableProps) {
  const renderCellValue = (value: string) => {
    if (value === '✓') {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/80">
          <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
        </span>
      )
    }
    if (value === '✗') {
      return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
          <XIcon className="h-3.5 w-3.5 text-gray-300" />
        </span>
      )
    }
    return value
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 shadow-md shadow-navy/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          {caption ? (
            <caption className="border-b border-gray-100 bg-[#FAFBFD] px-4 py-3 text-left text-[11px] leading-snug text-gray-500">
              {caption}
            </caption>
          ) : null}
          <thead>
            <tr className="bg-gradient-to-r from-navy to-navy-mid text-white">
              {data.headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`border-r border-white/10 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide last:border-r-0 ${
                    idx === 0 ? 'sticky left-0 z-10 bg-navy' : 'whitespace-nowrap'
                  }`}
                  scope="col"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`transition-colors hover:bg-cb-orange/[0.03] ${
                  rowIdx % 2 === 1 ? 'bg-[#FAFBFD]' : 'bg-white'
                }`}
              >
                {row.cells.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`border-t border-gray-100 px-4 py-3.5 ${
                      cellIdx === 0
                        ? 'sticky left-0 z-[1] bg-inherit font-medium text-navy shadow-[4px_0_8px_-4px_rgba(15,31,61,0.08)]'
                        : 'text-gray-600'
                    }`}
                  >
                    {renderCellValue(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
