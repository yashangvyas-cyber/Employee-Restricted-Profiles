/* HIDDEN PROFILE — VISIBILITY MAP
 *
 * Prototype-only screen. Answers one question per screen: does a hidden profile
 * appear there, and who can see them?
 *
 * Grouped by the ANSWER, not by portal. The section heading is the answer, so a
 * non-technical reader gets it without reading a cell. Portal is a label under
 * the screen name, because people think "the org chart", not "the People portal".
 *
 * A row is "Not decided yet" only when there is no answer at all. A row that has
 * an answer plus an open question stays in its real group and keeps its note -
 * burying the answer would lose it.
 */
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import brief from '../fixtures/impact-brief.json'

const BLANK = (v) => !v || v === '—' || v === 'NOT STATED'

/* Portal icons COPIED from the All Apps panel in
   modules/people/dom/employee_listing.html, so the label beside a screen name
   is the same glyph the portal carries everywhere else in the product.
   Global is not a portal and has no icon there - icon-globe-01 is chosen. */
const PORTAL_ICON = {
  'Global': 'icon-globe-01',
  'People': 'icon-users-02',
  'Payroll': 'icon-currency-rupee',
  'Recruitment': 'icon-jobs',
  'CRM & Invoice': 'icon-deals',
  'Project Management': 'icon-layers-three-02',
  'Reports': 'icon-bar-chart-square-01',
  'Administration': 'icon-administration',
}

const GROUPS = [
  { id: 'nobody', title: 'Nobody sees them', sub: 'The person does not appear here at all.',
    dot: 'bg-error-500', ring: 'border-error-200 bg-error-50 text-error-700',
    test: (r) => !BLANK(r.sees) && /^nobody/i.test(r.sees) },
  { id: 'some', title: 'Only some people see them', sub: 'The person appears, but only for the people named.',
    dot: 'bg-warning-500', ring: 'border-warning-200 bg-warning-50 text-warning-700',
    test: (r) => !BLANK(r.sees) && !/^nobody/i.test(r.sees) && !/^everyone/i.test(r.sees) },
  { id: 'everyone', title: 'Everyone sees them', sub: 'Anyone who can already open the screen sees the person.',
    dot: 'bg-success-500', ring: 'border-success-200 bg-success-50 text-success-700',
    test: (r) => !BLANK(r.sees) && /^everyone/i.test(r.sees) },
  { id: 'open', title: 'Not decided yet', sub: 'Nobody has answered what happens on these screens.',
    dot: 'bg-gray-400', ring: 'border-gray-300 bg-gray-100 text-gray-600',
    test: (r) => BLANK(r.sees) },
]

export default function ImpactBrief() {
  const [params, setParams] = useSearchParams()
  const portalFilter = params.get('portal')
  const [openRow, setOpenRow] = useState(null)

  const all = brief.portals.flatMap((p) => p.rows.map((r) => ({ ...r, portal: p.name })))
  const rows = portalFilter ? all.filter((r) => r.portal === portalFilter) : all
  /* A row's group is the answer to "is the hidden person treated differently
     from anyone else on this screen?" - not "who can see them". A screen only
     HR can open hides the person from nobody, so it belongs in "everyone".
     `group` on the row wins; otherwise it is derived from the audience. */
  const groups = GROUPS
    .map((g) => ({ ...g, rows: rows.filter((r) => (r.group ? r.group === g.id : g.test(r))) }))
    .filter((g) => g.rows.length)

  return (
    <div className="2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)] overflow-y-auto customScrollbar bg-gray-100">
      <div className="2xl:p-6 2xl-to-xl:p-4 p-4 max-w-[1100px]">

        <div className="mb-5">
          <h1 className="font-semibold text-gray-900 2xl:text-xl text-lg">Where does a hidden profile appear?</h1>
          <p className="mt-1 text-gray-600 2xl:text-sm text-xs">
            Every screen that shows an employee, and who can see a hidden one there.
          </p>
          {portalFilter && (
            <button
              type="button"
              onClick={() => { params.delete('portal'); setParams(params) }}
              className="mt-3 inline-flex items-center gap-x-2 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 py-1 px-3 2xl:text-xs text-xxs font-medium"
            >
              Showing {portalFilter} only
              <span className="icon-x-close text-sm" />
            </button>
          )}
        </div>

        {groups.map((g) => (
          <div key={g.id} className="mb-5">
            <div className="flex items-center gap-x-3 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${g.dot}`} />
              <h2 className="font-semibold text-gray-900 2xl:text-base text-sm">{g.title}</h2>
              <span className={`rounded-2xl border font-medium py-0.5 px-2 2xl:text-xs text-xxs ${g.ring}`}>
                {g.rows.length}
              </span>
            </div>
            <p className="text-gray-500 2xl:text-sm text-xs mb-2.5 ml-[22px]">{g.sub}</p>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden ml-[22px]">
              {g.rows.map((r, i) => {
                const key = r.portal + r.screen
                const isOpen = openRow === key
                return (
                  <div key={key} className={i ? 'border-t border-gray-100' : ''}>
                    <div
                      className={`2xl:px-5 px-4 2xl:py-3.5 py-3 flex items-start justify-between gap-x-6 ${r.flag ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      onClick={r.flag ? () => setOpenRow(isOpen ? null : key) : undefined}
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 2xl:text-sm text-xs">{r.screen}</p>
                        <p className="text-gray-400 2xl:text-xs text-xxs mt-0.5 flex items-center gap-x-1.5">
                          <span className={`${PORTAL_ICON[r.portal] ?? 'icon-globe-01'} 2xl:text-sm text-xs`} />
                          {r.portal}
                        </p>
                      </div>
                      <div className="min-w-0 2xl:w-[55%] w-[52%] shrink-0">
                        {!BLANK(r.sees) && (
                          <p className="text-gray-700 2xl:text-sm text-xs">{r.sees}</p>
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
                      <div className="2xl:px-5 px-4 pb-3.5 -mt-1">
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
