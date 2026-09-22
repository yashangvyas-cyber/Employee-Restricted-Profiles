/* HIDDEN PROFILE — VISIBILITY MAP
 *
 * ⚠ INVENTED SCREEN. This does not exist in CollabCRM and is not copied from any
 * capture. It is a prototype-only deliverable: one page that answers, portal by
 * portal, "does this person appear here, and to whom?".
 *
 * Its CONTENT is not invented - every row traces to a row in ma'am's impact list
 * (2026-09-22) via the `source` field in src/fixtures/impact-brief.json. Where
 * her list asked a question rather than gave a rule, the row says so instead of
 * answering it.
 *
 * Only the design tokens are copied, from _design-system/TOKENS.md, so the page
 * sits in the app without pretending to be a captured screen.
 */
import { useState } from 'react'
import brief from '../fixtures/impact-brief.json'

const TH =
  '2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:px-6 2xl-to-xl:px-4 px-4 whitespace-nowrap 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-gray-600 text-left bg-gray-50 top-0'
const TD =
  '2xl:px-6 2xl-to-xl:px-4 px-4 2xl:py-3 2xl-to-xl:py-2 py-2 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-600 text-left align-top'
const BADGE = 'rounded-2xl border flex w-max font-medium items-center py-0.5 px-2 2xl:text-xs 2xl-to-xl:text-xxs text-xxs whitespace-nowrap'

const RULE = Object.fromEntries(brief.rules.map((r) => [r.id, r]))

const STATUS = {
  BUILT:     { cls: 'border-success-200 bg-success-50 text-success-700', label: 'Built' },
  DECIDED:   { cls: 'border-gray-300 bg-gray-50 text-gray-700',          label: 'Decided' },
  OPEN:      { cls: 'border-error-200 bg-error-50 text-error-700',       label: 'Needs a decision' },
  AMBIGUOUS: { cls: 'border-warning-200 bg-warning-50 text-warning-700', label: 'Needs clarifying' },
}

export default function ImpactBrief() {
  const [openOnly, setOpenOnly] = useState(false)
  const portals = brief.portals
    .map((p) => ({ ...p, rows: p.rows.filter((r) => !openOnly || r.status === 'OPEN' || r.status === 'AMBIGUOUS') }))
    .filter((p) => p.rows.length)

  const all = brief.portals.flatMap((p) => p.rows)
  const unresolved = all.filter((r) => r.status === 'OPEN' || r.status === 'AMBIGUOUS').length

  return (
    <div className="2xl:p-5 2xl-to-xl:p-3 p-3">
      {/* heading */}
      <div className="bg-white border rounded-lg border-gray-200 2xl:p-5 2xl-to-xl:p-3 p-3 mb-3">
        <div className="flex items-start justify-between gap-x-4 flex-wrap gap-y-3">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 2xl:text-lg 2xl-to-xl:text-base text-base">Hidden Profile — Visibility Map</p>
            <p className="mt-1 text-gray-600 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs max-w-3xl">
              Where a hidden profile appears, and who can see them. {all.length} screens across {brief.portals.length} portals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpenOnly((v) => !v)}
            className={
              'outline-none rounded-lg border hover:opacity-90 px-4 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ' +
              (openOnly
                ? 'bg-indigo-600 border-transparent text-white'
                : 'bg-white border-gray-300 text-gray-700 enabled:hover:!bg-gray-50')
            }
          >
            <div className="flex items-center justify-center gap-2">
              <i className="icon-filter-lines" />
              {openOnly ? 'Showing unresolved only' : `Show the ${unresolved} unresolved`}
            </div>
          </button>
        </div>

        {/* the global principle, stated once */}
        <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 2xl:p-4 2xl-to-xl:p-3 p-3">
          <p className="font-semibold text-indigo-900 2xl:text-sm 2xl-to-xl:text-xs text-xs">The rule that overrides every screen</p>
          <p className="mt-1 text-indigo-800 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs">{brief.principle.text}</p>
        </div>

        {/* legend */}
        <div className="mt-4">
          <p className="font-semibold text-gray-900 2xl:text-sm 2xl-to-xl:text-xs text-xs">
            Every screen below uses one of these {brief.rules.length} rules — build the rules, not 26 special cases
          </p>
          <div className="mt-2 grid 2xl:grid-cols-2 grid-cols-1 gap-2">
            {brief.rules.map((r) => (
              <div key={r.id} className="flex items-start gap-x-3 rounded-lg border border-gray-200 2xl:p-3 p-2">
                <div className={`${BADGE} ${r.cls} shrink-0`}>{r.id}</div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 2xl:text-sm 2xl-to-xl:text-xs text-xs">{r.name}</p>
                  <p className="text-gray-600 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* one table per portal */}
      {portals.map((p) => (
        <div key={p.name} className="bg-white border rounded-lg border-gray-200 mb-3">
          <div className="flex items-center gap-x-3 border-b 2xl:p-4 2xl-to-xl:p-3 p-3 rounded-t-lg border-gray-200">
            <p className="2xl:text-base 2xl-to-xl:text-sm text-sm text-gray-900 font-semibold">{p.name}</p>
            <div className={`${BADGE} border-gray-300 bg-gray-50 text-gray-700`}>{p.rows.length} {p.rows.length === 1 ? 'screen' : 'screens'}</div>
            <p className="text-gray-600 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs">{p.note}</p>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className={`${TH} min-w-[220px]`}>Screen</th>
                  <th scope="col" className={`${TH} min-w-[90px]`}>Rule</th>
                  <th scope="col" className={`${TH} min-w-[200px]`}>Who sees them</th>
                  <th scope="col" className={`${TH} min-w-[200px]`}>Who does not</th>
                  <th scope="col" className={`${TH} min-w-[220px]`}>What the screen shows</th>
                  <th scope="col" className={`${TH} min-w-[140px]`}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA] bg-white">
                {p.rows.map((r) => {
                  const st = STATUS[r.status] ?? STATUS.DECIDED
                  const rule = RULE[r.rule]
                  return (
                    <tr key={p.name + r.screen} className="hover:bg-gray-50 align-top">
                      <td className={`${TD} font-medium text-gray-900`}>
                        {r.screen}
                        <p className="mt-0.5 font-normal text-gray-400 2xl:text-xs text-xxs">{r.source}</p>
                      </td>
                      <td className={TD}>
                        <div className={`${BADGE} ${rule.cls}`} title={rule.name}>{r.rule}</div>
                      </td>
                      <td className={TD}>{r.sees}</td>
                      <td className={TD}>{r.not}</td>
                      <td className={TD}>{r.treatment}</td>
                      <td className={TD}>
                        <div className={`${BADGE} ${st.cls}`}>{st.label}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* the notes that do not fit a cell - questions, warnings, my own calls */}
          {p.rows.some((r) => r.flag) && (
            <div className="border-t border-gray-200 2xl:p-4 2xl-to-xl:p-3 p-3 space-y-3">
              {p.rows.filter((r) => r.flag).map((r) => {
                const st = STATUS[r.status] ?? STATUS.DECIDED
                return (
                  <div key={r.screen} className="flex items-start gap-x-3">
                    <div className={`${BADGE} ${st.cls} shrink-0 mt-0.5`}>{st.label}</div>
                    <p className="text-gray-600 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs">
                      <span className="font-semibold text-gray-900">{r.screen} — </span>{r.flag}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      <p className="text-gray-500 font-normal 2xl:text-xs text-xxs 2xl:px-5 px-3">
        Source: {brief._source}
      </p>
    </div>
  )
}
