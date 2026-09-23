/* HIDDEN PROFILE — VISIBILITY MAP
 * Prototype-only screen: developer reference for hidden-profile visibility.
 * Tabbed by portal so you only see one portal's rules at a time.
 */
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import brief from '../fixtures/impact-brief.json'

/* ── Data setup ── */


const BADGE = 'rounded-full border inline-flex items-center font-medium py-0.5 px-2.5 2xl:text-xs text-xxs whitespace-nowrap'


export default function ImpactBrief() {
  const [params] = useSearchParams()
  const fromUrl = brief.portals.findIndex((p) => p.name === params.get('portal'))
  const [activePortal, setActivePortal] = useState(fromUrl >= 0 ? fromUrl : 0)
  const [expandedRow, setExpandedRow] = useState(null)


  const portal = brief.portals[activePortal]

  return (
    <div className="2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)] overflow-y-auto customScrollbar bg-gray-100">
      <div className="2xl:p-6 2xl-to-xl:p-4 p-4">

        {/* ━━ HEADER CARD ━━ */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4">
          {/* Title */}
          <div className="flex items-center justify-between gap-4 flex-wrap 2xl:px-5 px-4 2xl:pt-5 pt-4 2xl:pb-4 pb-3">
            <h1 className="font-semibold text-gray-900 2xl:text-lg text-base">Visibility Map</h1>
          </div>

          {/* Portal tabs */}
          <div className="flex items-center gap-1 border-t border-gray-200 2xl:px-5 px-4">
            {brief.portals.map((p, i) => {
              const isActive = i === activePortal
              const portalOpen = p.rows.filter((r) => r.status === 'OPEN' || r.status === 'AMBIGUOUS').length
              return (
                <button
                  key={p.name} type="button"
                  onClick={() => { setActivePortal(i); setExpandedRow(null) }}
                  className={`relative 2xl:px-4 px-3 2xl:py-2.5 py-2 2xl:text-sm text-xs font-medium transition-colors ${isActive
                      ? 'text-indigo-700 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {p.name}
                    <span className={`2xl:text-xxs text-xxs rounded-full px-1.5 py-px ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.rows.length}
                    </span>
                    {portalOpen > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-error-500" title={`${portalOpen} unresolved`} />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ━━ ACTIVE PORTAL CONTENT ━━ */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Portal description */}
          {portal.note && (
            <div className="2xl:px-5 px-4 2xl:py-2.5 py-2 border-b border-gray-100 bg-gray-50/50">
              <p className="text-gray-500 2xl:text-xs text-xxs">{portal.note}</p>
            </div>
          )}

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Screen', 'Visible to', 'Hidden from', 'UI treatment', ''].map((h, i) => (
                  <th key={h || i} className={`text-left 2xl:text-xs text-xxs font-medium text-gray-400 uppercase tracking-wider ${i === 0 ? '2xl:pl-5 pl-4' : 'pl-3'} pr-3 2xl:py-2.5 py-2 ${i === 4 ? 'w-10' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portal.rows.map((row, idx) => {
                const isExpanded = expandedRow === idx
                const hasNote = !!row.flag
                return (
                  <TableRow
                    key={row.screen} row={row} idx={idx}
                    isExpanded={isExpanded} hasNote={hasNote}
                    onToggle={() => setExpandedRow(isExpanded ? null : idx)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


/* ── Table row with optional expandable note ── */
function TableRow({ row, idx, isExpanded, hasNote, onToggle }) {
  return (
    <>
      <tr className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}>
        {/* Screen name */}
        <td className="2xl:pl-5 pl-4 pr-3 2xl:py-3 py-2.5">
          <p className="2xl:text-sm text-xs font-medium text-gray-900 leading-snug">{row.screen}</p>
          {row.source && <p className="2xl:text-xxs text-xxs text-gray-400 mt-0.5">{row.source}</p>}
        </td>

        {/* Visible to */}
        <td className="px-3 2xl:py-3 py-2.5 2xl:text-sm text-xs text-gray-700">
          {row.sees === '—' || row.sees === 'NOT STATED'
            ? <span className="text-gray-300 italic">{row.sees}</span>
            : row.sees}
        </td>

        {/* Hidden from */}
        <td className="px-3 2xl:py-3 py-2.5 2xl:text-sm text-xs text-gray-500">
          {row.not === '—' || row.not === 'NOT STATED'
            ? <span className="text-gray-300 italic">{row.not}</span>
            : row.not}
        </td>

        {/* Treatment */}
        <td className="px-3 2xl:py-3 py-2.5 2xl:text-sm text-xs text-gray-600">
          {row.treatment === '—' || row.treatment === 'NOT STATED'
            ? <span className="text-gray-300 italic">{row.treatment}</span>
            : row.treatment}
        </td>

        {/* Expand button */}
        <td className="px-2 2xl:py-3 py-2.5 text-center">
          {hasNote ? (
            <button type="button" onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors hover:bg-gray-100" title="Show developer notes">
              <svg className={`w-4 h-4 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <span className="w-4 h-4 inline-block" />
          )}
        </td>
      </tr>

      {/* Expandable note row */}
      {isExpanded && hasNote && (
        <tr className="bg-gray-50/30">
          <td colSpan={5} className="2xl:pl-5 pl-4 pr-4 pb-3 pt-1">
            <div className={`rounded-lg 2xl:px-4 px-3 2xl:py-2.5 py-2 2xl:text-xs text-xxs leading-relaxed border ${row.status === 'OPEN' || row.status === 'AMBIGUOUS'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
              {row.flag}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}


/* ── Mini stat in header ── */
