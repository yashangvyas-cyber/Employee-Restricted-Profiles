/* Employee listing.
 * Source DOM : modules/people/dom/employee_listing.html      (2026-09-21)
 *              modules/people/dom/employee_listing_empty.html (empty state)
 *              modules/people/dom/employee_listing_page2.html (pagination)
 * Source API : POST /v1/employee/list, GET /v1/employee/status-counts
 * Columns, KPI cards, filter bar, pagination and row actions are all copies. */
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { employeeList, employeeStatusCounts } from '../api/mockApi'
import { peoplePath } from '../lib/tenant'
import StatCard from '../components/StatCard'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import { Avatar, Pill, StatusPill, PersonChip, TH, TD, BTN_PRIMARY, ROW_TINT } from '../components/primitives'

/* Vertical stickiness comes from the app's own rule
     .tableSticky thead th { position: sticky; z-index: 9 }
   combined with top-0 on every th. The Actions th additionally carries
   `sticky right-0`, which is what freezes it during HORIZONTAL scroll - both
   th class strings below are copied from the crawled thead. */
const TH_ACTIONS =
  '2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:px-6 2xl-to-xl:px-4 px-4 whitespace-nowrap 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-gray-600 bg-gray-50 top-0 text-start w-3 sticky right-0'

const COLUMNS = [
  { label: 'No.',          sortable: false, thExtra: 'w-[1%]' },
  { label: 'Code',         sortable: true,  sort_by: 'employee_code' },
  { label: 'Name',         sortable: true,  sort_by: 'name', thExtra: 'min-w-[250px]' },
  { label: 'Department',   sortable: true,  sort_by: 'department_name' },
  { label: 'Contact',      sortable: false },
  { label: 'Status',       sortable: true,  sort_by: 'status' },
  { label: 'Reporting to', sortable: true,  sort_by: 'reporting_name', thExtra: 'min-w-40' },
  { label: 'Experience',   sortable: false, thExtra: 'z-[10]' },
  { label: 'Joining Date', sortable: true,  sort_by: 'joined_date' },
  { label: 'Last Login',   sortable: false },
  { label: 'Actions',      sortable: false, thClass: TH_ACTIONS },
]

const fmtDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  if (Number.isNaN(+dt)) return '-'
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${String(dt.getDate()).padStart(2,'0')}-${M[dt.getMonth()]}-${dt.getFullYear()}`
}
const fmtDateTime = (d) => {
  if (!d) return '-'
  const dt = new Date(d)
  if (Number.isNaN(+dt)) return '-'
  let h = dt.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12
  return `${fmtDate(d)}, ${String(h).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')} ${ap}`
}
/* The Experience column is TENURE, not previous experience: a row joined
   01-Jul-2026 rendered "2M" and one joined 01-Apr-2020 rendered "6Y 5M" in the
   crawled listing. Computed from joined_date to today. */
const fmtExp = (joined) => {
  if (!joined) return '-'
  const d = new Date(joined); if (Number.isNaN(+d)) return '-'
  const now = new Date()
  let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
  if (now.getDate() < d.getDate()) months -= 1
  if (months < 0) return '-'
  const y = Math.floor(months / 12), m = months % 12
  return [y ? `${y}Y` : null, m ? `${m}M` : null].filter(Boolean).join(' ') || '0M'
}

export default function EmployeeListing() {
  const [params, setParams] = useSearchParams()
  /* OPEN DECISION — no 7-card stat row exists in CollabCRM. Default is the
     wrapped row; ?grid=7 shows the single 7-column row. */
  const STAT_GRID = params.get('grid') === '7' ? 'grid grid-cols-7' : 'grid grid-cols-4'
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10 })
  const [counts, setCounts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [sort, setSort] = useState({ sort_by: null, order: null })

  // chips live in the URL as ?filterQuery=[{field_name,operator,value}] - the
  // same param and shape the real app uses (VERIFIED).
  const chips = useMemo(() => {
    try { return JSON.parse(params.get('filterQuery') || '[]') } catch { return [] }
  }, [params])

  const writeChips = (next) => {
    const p = new URLSearchParams(params)
    if (next.length) p.set('filterQuery', JSON.stringify(next))
    else p.delete('filterQuery')
    setParams(p, { replace: true })
    setPage(1)
  }

  useEffect(() => {
    let live = true
    setLoading(true)
    employeeList({
      page, per_page: perPage,
      filters: chips.map(({ field_name, operator, value }) => ({ field_name, operator, value })),
      ...(sort.sort_by ? { sort_by: sort.sort_by, order: sort.order } : {}),
    }).then((res) => {
      if (!live) return
      setRows(res.data); setMeta(res.meta); setLoading(false)
    })
    return () => { live = false }
  }, [page, perPage, chips, sort])

  useEffect(() => { employeeStatusCounts().then((r) => setCounts(r.data)) }, [])

  const toggleSort = (col) => {
    if (!col.sortable) return
    setSort((s) =>
      s.sort_by !== col.sort_by ? { sort_by: col.sort_by, order: 'ASC' }
      : s.order === 'ASC' ? { sort_by: col.sort_by, order: 'DESC' }
      : { sort_by: null, order: null })
    setPage(1)
  }

  const from = meta.total === 0 ? 0 : (meta.page - 1) * meta.per_page + 1
  const to = Math.min(meta.page * meta.per_page, meta.total)

  return (
    <>
      {/* KPI cards - labels and order copied from the live listing.
          STAT_GRID is the open decision: CollabCRM has no 7-card row anywhere,
          so both options are built and screenshotted for the BA to pick.
          Flip via ?grid=7 or ?grid=wrap on the URL. */}
      <div className={`${STAT_GRID} gap-4 w-full pb-5 relative`}>
        <StatCard label="Active Employees" value={counts?.total_employees ?? '-'}     action="add" />
        <StatCard label="Confirmed"        value={counts?.total_confirmed ?? '-'}     action="verified" />
        <StatCard label="Intern"           value={counts?.total_intern ?? '-'}        disabled={counts?.total_intern === '0'} />
        <StatCard label="On Probation"     value={counts?.total_probation ?? '-'} />
        <StatCard label="On Notice Period" value={counts?.total_notice_period ?? '-'} disabled={counts?.total_notice_period === '0'} />
        <StatCard label="Joining Soon"     value={counts?.total_yet_to_join ?? '-'} />
        {/* NEW — 7th card. Clicking it applies is_restricted Is true, exactly as
            the other cards apply their own filter. [PROPOSED] */}
        <StatCard
          label="Restricted"
          value={counts?.total_restricted ?? '-'}
          onClick={() => writeChips([{ label: 'Restricted', field_name: 'is_restricted', operator: 'Is', value: 'true' }])}
        />
      </div>

      {/* toolbar */}
      <div className="2xl:py-4 2xl:px-5 2xl-to-xl:py-2 py-2 2xl-to-xl:px-3 px-3 bg-white sticky top-0 z-2 border rounded-tl-lg rounded-tr-lg border-gray-200 border-b after:absolute after:w-[calc(100%+16px)] after:h-4 after:-top-[18px] after:-left-2 after:bg-gray-100 after:-z-1">
        <div className="flex justify-between">
          <div className="flex gap-x-2.5 items-center">
            <p className="font-semibold text-gray-900 2xl:text-lg 2xl-to-xl:text-base text-base">Employees</p>
            <div className="rounded-2xl border flex w-max font-medium items-center border-indigo-200 bg-indigo-50 text-indigo-700 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs 2xl:!py-0.5 2xl-to-xl:!py-0 !py-0 py-0.5 px-2 text-xs">
              <span>
                <span className="font-bold">{from}&nbsp;-&nbsp;{to}</span>
                <span className="font-medium"> of {meta.total} Employees</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-px h-9">
              <Link to={peoplePath('/employee/add')} className={`${BTN_PRIMARY} rounded-tr-none rounded-br-none inline-flex items-center`}>
                <div className="flex items-center justify-center gap-2">Add Employee</div>
              </Link>
              <button
                title="Import Employees"
                className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 disabled:bg-indigo-200 px-4 border-transparent icon-file-import flex justify-center 2xl:w-[50px] 2xl-to-xl:w-10 w-10 items-center text-white bg-indigo-600 2xl:text-lg 2xl-to-xl:text-base text-base rounded-tl-none rounded-bl-none rounded-tr-lg rounded-br-lg cursor-pointer hover:opacity-90 2xl:py-[7px] 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8"
              />
            </div>
            <div className="rounded-lg flex items-center cursor-pointer relative">
              <button className="cursor-pointer rounded-lg border 2xl:w-9 2xl:h-9 2xl-to-xl:w-8 2xl-to-xl:h-8 w-8 h-8 flex items-center justify-center duration-300 outline-none border-gray-300">
                <span className="2xl:text-xl 2xl-to-xl:text-lg text-lg block text-gray-700 icon-maximize-01" />
              </button>
            </div>
            <button className="cursor-pointer flex items-center justify-center duration-300 outline-none rounded-lg border border-gray-300" style={{ width: 32, height: 32 }}>
              <span className="2x:text-xl 2xl-to-xl:text-lg text-lg block icon-dots-vertical text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 sticky -top-1 z-1 h-4 -mt-4 w-full" />

      <FilterBar
        chips={chips}
        onApply={(c) => writeChips([...chips, c])}
        onRemoveChip={(i) => writeChips(chips.filter((_, k) => k !== i))}
        onClearAll={() => writeChips([])}
      />

      {/* table */}
      <div className="z-0 relative">
        <div className="flex flex-col">
          <div className="inline-block w-full align-middle">
            <div className="sidebar-container border overflow-auto scrollbar-hide z-0 relative border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 tableSticky">
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th
                      key={c.label}
                      scope="col"
                      className={c.thClass || `${TH} ${c.thExtra || ''} ${c.sortable ? 'cursor-pointer' : ''}`}
                      onClick={() => toggleSort(c)}
                    >
                      <div className="">
                        {c.sortable ? (
                          <div className="flex">
                            <span className="self-center">{c.label}</span>
                            <div className="flex items-center">
                              <span className="text-gray-300 text-base icon-sort ml-1" />
                            </div>
                          </div>
                        ) : c.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA] bg-white">
                {loading && (
                  <tr><td colSpan={COLUMNS.length} className={`${TD} text-center py-10`}>Loading…</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  /* empty state - string copied from employee_listing_empty.html */
                  <tr>
                    <td colSpan={COLUMNS.length} className="text-center py-16">
                      <p className="text-gray-500 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium">No Result Found</p>
                    </td>
                  </tr>
                )}
                {!loading && rows.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`h-[65px] group hover:bg-gray-50${r.is_restricted ? ` ${ROW_TINT}` : ''}`}
                    {...(r.is_restricted
                      ? {
                          /* mirrors how the app marks an inactive profile: the row
                             carries the state and hovering explains it. The app
                             attaches react-tooltip via data-tooltip-id; `title`
                             makes it work in the prototype. Exact tooltip styling
                             is NOT CAPTURED - see GAPS.md. */
                          'data-tooltip-id': `restricted+${r.id}`,
                          'data-tooltip-content': 'This profile is restricted.',
                          title: 'This profile is restricted.',
                        }
                      : {})}
                  >
                    <td className={`${TD} w-[1%]`}>
                      <p className="text-gray-900 max-w-[160px] truncate font-medium line-clamp1">{from + i}</p>
                    </td>
                    <td className={TD}>
                      <div><p className="text-gray-900 max-w-[160px] truncate font-medium line-clamp1">{r.employee_code}</p></div>
                    </td>
                    <td className={`${TD} min-w-[250px]`}>
                      <div>
                        <Link
                          className="grid 2xl:grid-cols-[35px_1fr] 2xl-to-xl:grid-cols-[32px_1fr] grid-cols-[32px_1fr] min-w-0 items-center 2xl:gap-x-4 2xl-to-xl:gap-x-2 gap-x-2"
                          title={r.name}
                          to={peoplePath(`/employee-detail/${r.id}/general-info`)}
                        >
                          <Avatar name={r.name} />
                          <div className="min-w-0 flex-auto mr-10">
                            <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold leading-6 text-gray-900 text-ellipsis overflow-hidden min-w-36" title={r.name}>{r.name}</p>
                            <p className="truncate 2xl:text-xs 2xl-to-xl:text-xxs text-xxs leading-5 text-gray-500">{r.designation_name}</p>
                          </div>
                        </Link>
                      </div>
                    </td>
                    <td className={TD}>{r.department_name ? <Pill>{r.department_name}</Pill> : <span className="text-gray-400">-</span>}</td>
                    <td className={TD}>
                      <p>{r.email}</p>
                      <p>{r.personal_mobile ? `+${r.personal_country_code || '91'} ${r.personal_mobile}` : '-'}</p>
                    </td>
                    <td className={TD}><StatusPill status={r.status} /></td>
                    <td className={`${TD} min-w-40`}><PersonChip name={r.reporting_name} /></td>
                    <td className={TD}><div className="text-center">{fmtExp(r.joined_date)}</div></td>
                    <td className={TD}><div className="text-center">{fmtDate(r.joined_date)}</div></td>
                    <td className={TD}>
                      <div className="w-36 flex items-center gap-x-2 whitespace-normal">
                        <span className="inline-block w-5" />{fmtDateTime(r.last_login_time)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap 2xl:px-6 2xl-to-xl:px-4 px-4 2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-600 text-start w-3 sticky right-0 border-l">
                      <div className="before:absolute before:w-[1px] before:h-full before:bg-gray-200 before:top-0 before:left-[-1px]">
                        <div className="flex items-center 2xl:gap-x-2.5 2xl-to-xl:gap-x-2 gap-x-2 text-gray-600 2xl:text-xl 2xl-to-xl:text-lg text-lg justify-start">
                          <Link to={peoplePath(`/employee-detail/${r.id}/general-info`)}>
                            <span className="icon-eye cursor-pointer" />
                          </Link>
                          <Link to={peoplePath(`/employee/${r.id}/edit`)}>
                            <span className="icon-edit-01 cursor-pointer" />
                          </Link>
                        </div>
                      </div>
                      {/* the sticky cell paints its own background; without this
                          the frozen column stays white while the row is tinted */}
                      <div className={`absolute top-px left-0 right-0 bottom-0 -z-10 group-hover:bg-gray-50 ${r.is_restricted ? ROW_TINT : 'bg-white'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        page={meta.page}
        perPage={meta.per_page}
        total={meta.total}
        onPage={setPage}
        onPerPage={(n) => { setPerPage(n); setPage(1) }}
      />
    </>
  )
}
