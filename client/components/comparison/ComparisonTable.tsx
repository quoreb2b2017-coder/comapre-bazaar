import type { ComparisonTableData } from '@/types'
import { CheckIcon, XIcon } from '@/components/ui/icons'

interface ComparisonTableProps {
  data: ComparisonTableData
  caption?: string
}

export function ComparisonTable({ data, caption }: ComparisonTableProps) {
  const renderCellValue = (value: string) => {
    if (value === '✓') {
      return <CheckIcon className="inline-block h-4 w-4 align-middle text-cb-orange" />
    }
    if (value === '✗') {
      return <XIcon className="inline-block h-4 w-4 align-middle text-gray-300" />
    }
    return value
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {caption ? (
          <caption className="border-b border-gray-200 bg-[#FAFBFD] px-4 py-2.5 text-left text-[11px] leading-snug text-gray-500">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="bg-navy text-white">
            {data.headers.map((header, idx) => (
              <th
                key={idx}
                className="border-r border-white/10 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide last:border-r-0 whitespace-nowrap"
                scope="col"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 1 ? 'bg-[#FAFBFD]' : 'bg-white'}>
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`border-t border-gray-100 px-4 py-3 ${
                    cellIdx === 0 ? 'font-medium text-navy' : 'text-gray-600'
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
  )
}
