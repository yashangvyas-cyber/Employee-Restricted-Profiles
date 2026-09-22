/* HIDDEN PROFILE — VISIBILITY MAP
 * Prototype-only screen: developer reference for hidden-profile visibility.
 * Tabbed by portal so you only see one portal's rules at a time.
 */
import { useState, useMemo } from 'react'
import brief from '../fixtures/impact-brief.json'

/* ── Data setup ── */
const RULE_MAP = Object.fromEntries(brief.rules.map((r) => [r.id, r]))

const STATUS_CFG = {
  BUILT:     { bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-700', dot: 'bg-success-500', label: 'Built' },
  DECIDED:   { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-600',    dot: 'bg-gray-400',    label: 'Decided' },
  OPEN:      { bg: 'bg-error-50',   border: 'border-error-200',   text: 'text-error-700',   dot: 'bg-error-500',   label: 'Open' },
  AMBIGUOUS: { bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-700', dot: 'bg-warning-500', label: 'Unclear' },
}

const BADGE = 'rounded-full border inline-flex items-center font-medium py-0.5 px-2.5 2xl:text-xs text-xxs whitespace-nowrap'


export default function ImpactBrief() {
  const [activePortal, setActivePortal] = useState(0)
  const [expandedRow, setExpandedRow] = useState(null)
  const [showLegend, setShowLegend] = useState(false)

  const allRows = useMemo(() => brief.portals.flatMap((p) => p.rows), [])
  const counts = useMemo(() => ({
    total: allRows.length,
    built: allRows.filter((r) => r.status === 'BUILT').length,
    decided: allRows.filter((r) => r.status === 'DECIDED').length,
    open: allRows.filter((r) => r.status === 'OPEN' || r.status === 'AMBIGUOUS').length,
  }), [allRows])

  const portal = brief.portals[activePortal]

  return (
    <div className="2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)] overflow-y-auto customScrollbar bg-gray-100">
      <div className="2xl:p-6 2xl-to-xl:p-4 p-4">

        {/* ━━ TOP BAR: title + stats ━━ */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-gray-900 2xl:text-lg text-base">Visibility Map</h1>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-3">
              <MiniStat count={counts.built} label="Built" dotCls="bg-success-500" />
              <MiniStat count={counts.decided} label="Decided" dotCls="bg-gray-400" />
              <MiniStat count={counts.open} label="Open" dotCls="bg-error-500" />
            </div>
          </div>
          <button
            type="button" onClick={() => setShowLegend((v) => !v)}
            className="outline-none rounded-lg border border-gray-300 bg-white hover:bg-gray-50 px-3 2xl:h-8 h-7 2xl:text-xs text-xxs font-medium text-gray-600 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            {showLegend ? 'Hide' : 'Show'} rules legend
          </button>
        </div>

        {/* ━━ OVERRIDE PRINCIPLE ━━ */}
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 2xl:px-4 px-3 2xl:py-2.5 py-2 mb-4 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="2xl:text-sm text-xs text-indigo-900 leading-relaxed">
            <span className="font-semibold">Global override:</span> {brief.principle.text}
          </p>
        </div>

        {/* ━━ RULES LEGEND (collapsible) ━━ */}
        {showLegend && (
          <div className="rounded-lg border border-gray-200 bg-white 2xl:p-4 p-3 mb-4">
            <div className="grid 2xl:grid-cols-5 grid-cols-3 gap-3">
              {brief.rules.map((r) => (
                <div key={r.id} className="flex items-start gap-2">
                  <span className={`${BADGE} ${r.cls} shrink-0`}>{r.id}</span>
                  <div>
                    <p className="font-medium text-gray-900 2xl:text-xs text-xxs">{r.name}</p>
                    <p className="text-gray-500 2xl:text-xxs text-xxs mt-0.5 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━ PORTAL TABS ━━ */}
        <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
          {brief.portals.map((p, i) => {
            const isActive = i === activePortal
            const portalOpen = p.rows.filter((r) => r.status === 'OPEN' || r.status === 'AMBIGUOUS').length
            return (
              <button
                key={p.name} type="button"
                onClick={() => { setActivePortal(i); setExpandedRow(null) }}
                className={`relative 2xl:px-4 px-3 2xl:py-2.5 py-2 2xl:text-sm text-xs font-medium transition-colors rounded-t-lg ${
                  isActive
                    ? 'text-indigo-700 bg-white border border-b-0 border-gray-200 -mb-px'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
                {['Screen', 'Rule', 'Visible to', 'Hidden from', 'UI treatment', 'Status', ''].map((h, i) => (
                  <th key={h || i} className={`text-left 2xl:text-xs text-xxs font-medium text-gray-400 uppercase tracking-wider ${i === 0 ? '2xl:pl-5 pl-4' : 'pl-3'} pr-3 2xl:py-2.5 py-2 ${i === 6 ? 'w-10' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portal.rows.map((row, idx) => {
                const st = STATUS_CFG[row.status] ?? STATUS_CFG.DECIDED
                const rule = RULE_MAP[row.rule]
                const isExpanded = expandedRow === idx
                const hasNote = !!row.flag
                return (
                  <TableRow
                    key={row.screen} row={row} idx={idx}
                    status={st} rule={rule}
                    isExpanded={isExpanded} hasNote={hasNote}
                    onToggle={() => setExpandedRow(isExpanded ? null : idx)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ━━ FOOTER ━━ */}
        <p className="text-gray-400 2xl:text-xxs text-xxs mt-4">
          {counts.total} screens across {brief.portals.length} portals · {brief._source}
        </p>
      </div>
    </div>
  )
}


/* ── Table row with optional expandable note ── */
function TableRow({ row, idx, status, rule, isExpanded, hasNote, onToggle }) {
  return (
    <>
      <tr className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}>
        {/* Screen name */}
        <td className="2xl:pl-5 pl-4 pr-3 2xl:py-3 py-2.5">
          <p className="2xl:text-sm text-xs font-medium text-gray-900 leading-snug">{row.screen}</p>
          <p className="2xl:text-xxs text-xxs text-gray-400 mt-0.5">{row.source}</p>
        </td>

        {/* Rule badge */}
        <td className="px-3 2xl:py-3 py-2.5">
          <span className={`${BADGE} ${rule.cls}`} title={`${rule.id}: ${rule.name}`}>{row.rule}</span>
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

        {/* Status */}
        <td className="px-3 2xl:py-3 py-2.5">
          <span className={`inline-flex items-center gap-1.5 ${BADGE} ${status.border} ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
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
          <td colSpan={7} className="2xl:pl-5 pl-4 pr-4 pb-3 pt-1">
            <div className={`rounded-lg 2xl:px-4 px-3 2xl:py-2.5 py-2 2xl:text-xs text-xxs leading-relaxed border ${
              row.status === 'OPEN' || row.status === 'AMBIGUOUS'
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
function MiniStat({ count, label, dotCls }) {
  return (
    <span className="flex items-center gap-1.5 2xl:text-sm text-xs text-gray-600">
      <span className={`w-2 h-2 rounded-full ${dotCls}`} />
      <span className="font-semibold text-gray-900">{count}</span>
      <span>{label}</span>
    </span>
  )
}
