import type { ComparisonTableData } from '@/types'
import { CheckIcon, XIcon } from '@/components/ui/icons'

interface ComparisonTableProps {
  data: ComparisonTableData
  caption?: string
}

export function ComparisonTable({ data, caption }: ComparisonTableProps) {
  const renderCellValue = (value: string) => {
    if (value === '✓') {
      return <CheckIcon className="w-4 h-4 text-[#F27F25] inline-block align-middle" />
    }

    if (value === '✗') {
      return <XIcon className="w-4 h-4 text-[#F27F25] inline-block align-middle" />
    }

    return value
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm border-collapse">
        {caption && (
          <caption className="text-left text-xs text-gray-400 py-2 px-4 bg-gray-50 border-b border-gray-200">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {data.headers.map((header, idx) => (
              <th
                key={idx}
                className="bg-navy text-white text-xs font-medium px-4 py-3 text-left whitespace-nowrap"
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
              className={rowIdx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
            >
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    cellIdx === 0 ? 'font-semibold text-navy' : 'text-gray-600'
                  } ${cell === '✓' ? 'text-[#F27F25]' : ''} ${cell === '✗' ? 'text-[#F27F25]' : ''}`}
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
