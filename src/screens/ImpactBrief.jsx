/* HIDDEN PROFILE — VISIBILITY MAP
 *
 * Prototype-only screen. One question per screen: is a hidden profile shown
 * there, and to whom?
 *
 * Grouped BY PORTAL, because a developer works on one portal at a time and
 * grouping by category scattered their screens across six sections. The verdict
 * chip carries the answer per row, so a non-technical reader still gets it at a
 * glance without reading a cell.
 *
 * The rule behind the verdicts:
 *   public screen (any employee can open it)  -> the person does not appear
 *   restricted screen (HR / Admin / RM only)  -> the person appears, marked
 */
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import brief from '../fixtures/impact-brief.json'

/* Portal icons COPIED from the All Apps panel in employee_listing.html. */
const PORTAL_ICON = {
  'Global': 'icon-globe-01', 'People': 'icon-users-02', 'Payroll': 'icon-currency-rupee',
  'Recruitment': 'icon-jobs', 'CRM & Invoice': 'icon-deals',
  'Project Management': 'icon-layers-three-02', 'Reports': 'icon-bar-chart-square-01',
  'Administration': 'icon-administration',
}

const VERDICT = {
  hidden: { label: 'Hidden',      cls: 'border-error-200 bg-error-50 text-error-700',     dot: 'bg-error-500' },
  shown:  { label: 'Shown',       cls: 'border-success-200 bg-success-50 text-success-700', dot: 'bg-success-500' },
  open:   { label: 'Not decided', cls: 'border-gray-300 bg-gray-100 text-gray-600',       dot: 'bg-gray-400' },
}
const BLANK = (v) => !v || v === '—' || v === 'NOT STATED'

export default function ImpactBrief() {
  const [params, setParams] = useSearchParams()
  const portalFilter = params.get('portal')
  const [openRow, setOpenRow] = useState(null)

  const portals = brief.portals.filter((p) => !portalFilter || p.name === portalFilter)

  return (
    <div className="2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)] overflow-y-auto customScrollbar bg-gray-100">
      <div className="2xl:p-6 2xl-to-xl:p-4 p-4 max-w-[1150px]">

        <div className="mb-4">
          <h1 className="font-semibold text-gray-900 2xl:text-xl text-lg">Where does a hidden profile appear?</h1>
          <p className="mt-1 text-gray-600 2xl:text-sm text-xs">
            On a screen any employee can open, the person does not appear. On a restricted screen —
            HR, Admin or the reporting manager — the person appears with a highlighted row and the
            incognito icon.
          </p>
          {portalFilter && (
            <button
              type="button"
              onClick={() => { params.delete('portal'); setParams(params) }}
              className="mt-3 inline-flex items-center gap-x-2 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 py-1 px-3 2xl:text-xs text-xxs font-medium"
            >
              Showing {portalFilter} only<span className="icon-x-close text-sm" />
            </button>
          )}
        </div>

        {portals.map((p) => (
          <div key={p.name} className="mb-4">
            <div className="flex items-center gap-x-2 mb-2">
              <span className={`${PORTAL_ICON[p.name] ?? 'icon-globe-01'} text-gray-500 2xl:text-lg text-base`} />
              <h2 className="font-semibold text-gray-900 2xl:text-base text-sm">{p.name}</h2>
              <span className="rounded-2xl border border-gray-300 bg-white text-gray-600 font-medium py-0.5 px-2 2xl:text-xs text-xxs">
                {p.rows.length}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {p.rows.map((r, i) => {
                const v = VERDICT[r.verdict] ?? VERDICT.open
                const key = p.name + r.screen
                const isOpen = openRow === key
                return (
                  <div key={key} className={i ? 'border-t border-gray-100' : ''}>
                    <div
                      className={`2xl:px-5 px-4 2xl:py-3 py-2.5 flex items-start gap-x-4 ${r.flag ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      onClick={r.flag ? () => setOpenRow(isOpen ? null : key) : undefined}
                    >
                      <p className="font-medium text-gray-900 2xl:text-sm text-xs 2xl:w-[38%] w-[36%] shrink-0">{r.screen}</p>

                      <span className={`rounded-2xl border font-medium py-0.5 px-2.5 2xl:text-xs text-xxs whitespace-nowrap shrink-0 ${v.cls}`}>
                        {v.label}
                      </span>

                      <div className="min-w-0 flex-1">
                        {!BLANK(r.sees) && r.sees !== 'Nobody' && (
                          <p className="text-gray-700 2xl:text-sm text-xs">Seen by {r.sees}</p>
                        )}
                        {!BLANK(r.treatment) && (
                          <p className="text-gray-500 2xl:text-xs text-xxs mt-0.5">{r.treatment}</p>
                        )}
                        {r.flag && (
                          <p className="text-indigo-600 2xl:text-xs text-xxs mt-1 font-medium">
                            {isOpen ? 'Hide detail' : 'Read more'}
                          </p>
                        )}
                      </div>
                    </div>
                    {isOpen && r.flag && (
                      <div className="2xl:px-5 px-4 pb-3 -mt-1">
                        <div className="rounded-lg border border-warning-200 bg-warning-50 text-warning-900 2xl:px-4 px-3 2xl:py-2.5 py-2 2xl:text-xs text-xxs leading-relaxed">
                          {r.flag}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
