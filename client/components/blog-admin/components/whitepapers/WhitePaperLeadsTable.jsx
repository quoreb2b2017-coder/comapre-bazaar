import { Check, Download, Inbox, Loader2, Mail, X } from 'lucide-react'

export function WhitePaperLeadsTable({
  rows = [],
  loading = false,
  emptyMessage = 'No download submissions yet.',
  showWhitepaperColumn = true,
  page = 1,
  pageSize = 25,
}) {
  const colSpan = showWhitepaperColumn ? 11 : 10

  return (
    <div className="xl-scroll">
      <table className="xl-table">
        <thead>
          <tr>
            <th className="xl-th xl-th-row">#</th>
            {showWhitepaperColumn ? <th className="xl-th">Whitepaper</th> : null}
            <th className="xl-th">Status</th>
            <th className="xl-th">Email</th>
            <th className="xl-th">First name</th>
            <th className="xl-th">Last name</th>
            <th className="xl-th">Job title</th>
            <th className="xl-th">Phone</th>
            <th className="xl-th">Company address</th>
            <th className="xl-th">Form answers</th>
            <th className="xl-th xl-th-center">Consent</th>
            <th className="xl-th">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="xl-empty">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-brand" />
                Loading submissions…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="xl-empty">
                <Inbox className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" strokeWidth={1.25} />
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => {
              const rowNum = (page - 1) * pageSize + idx + 1
              const submitted = r.downloadedAt || r.createdAt
              return (
                <tr key={r._id}>
                  <td className="xl-td xl-td-row">{rowNum}</td>
                  {showWhitepaperColumn ? (
                    <td className="xl-td">
                      {r.whitePaperUrl ? (
                        <a
                          href={r.whitePaperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-2 font-medium leading-snug"
                          title={r.whitePaperSlug ? `/resources/whitepaper/${r.whitePaperSlug}` : r.whitePaperTitle}
                        >
                          {r.whitePaperTitle}
                        </a>
                      ) : (
                        <span className="line-clamp-2 font-medium leading-snug text-gray-900 dark:text-gray-100">
                          {r.whitePaperTitle}
                        </span>
                      )}
                    </td>
                  ) : null}
                  <td className="xl-td">
                    {r.profileCompleted ? (
                      <span className="xl-pill xl-pill-ok">
                        <Download className="h-3 w-3" />
                        Downloaded
                      </span>
                    ) : (
                      <span className="xl-pill xl-pill-pending">
                        <Mail className="h-3 w-3" />
                        Email only
                      </span>
                    )}
                  </td>
                  <td className="xl-td">
                    <a href={`mailto:${r.email}`} className="break-all">
                      {r.email}
                    </a>
                  </td>
                  <td className="xl-td">{r.firstName || '—'}</td>
                  <td className="xl-td">{r.lastName || '—'}</td>
                  <td className="xl-td">{r.jobTitle || '—'}</td>
                  <td className="xl-td whitespace-nowrap">{r.workPhone || '—'}</td>
                  <td className="xl-td text-[12px] leading-relaxed text-gray-600 dark:text-gray-400">
                    <span title={r.companyAddress || ''}>{r.companyAddress || '—'}</span>
                  </td>
                  <td className="xl-td text-[12px] leading-relaxed text-gray-600 dark:text-gray-400">
                    {r.customAnswers?.length ? (
                      <div className="space-y-1">
                        {r.customAnswers.map((a, i) => (
                          <p key={`${r._id}-answer-${i}`} title={`${a.question}: ${a.answer}`}>
                            <span className="font-medium text-gray-700 dark:text-gray-300">{a.question}:</span>{' '}
                            {a.answer || '—'}
                          </p>
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="xl-td text-center">
                    {r.marketingConsent ? (
                      <span className="inline-flex text-emerald-600 dark:text-emerald-400" title="Consent: Yes">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="inline-flex text-gray-300 dark:text-gray-600" title="Consent: No">
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </td>
                  <td className="xl-td whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {submitted ? formatSubmitted(submitted) : '—'}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function formatSubmitted(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return (
    <>
      <span className="block font-medium text-gray-800 dark:text-gray-200">{d.toLocaleDateString()}</span>
      <span className="block text-[11px] text-gray-400">
        {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </>
  )
}

export function WhitePaperLeadsMetrics({ stats, pagination, rows }) {
  const pageCompleted = rows.filter((r) => r.profileCompleted).length
  const pageEmailOnly = rows.filter((r) => !r.profileCompleted).length

  return (
    <div className="xl-metric-bar">
      <div className="xl-metric">
        <p className="xl-metric-label">Total leads</p>
        <p className="xl-metric-value">{stats?.totalLeadRecords ?? pagination?.total ?? 0}</p>
      </div>
      <div className="xl-metric">
        <p className="xl-metric-label">PDF downloaded</p>
        <p className="xl-metric-value text-emerald-700 dark:text-emerald-400">{stats?.totalLeads ?? 0}</p>
      </div>
      <div className="xl-metric">
        <p className="xl-metric-label">Email only</p>
        <p className="xl-metric-value text-amber-700 dark:text-amber-400">{stats?.emailOnlyLeads ?? 0}</p>
      </div>
      <div className="xl-metric">
        <p className="xl-metric-label">On this page</p>
        <p className="xl-metric-value text-base font-semibold text-gray-600 dark:text-gray-300">
          {pageCompleted} done · {pageEmailOnly} partial
        </p>
      </div>
    </div>
  )
}
