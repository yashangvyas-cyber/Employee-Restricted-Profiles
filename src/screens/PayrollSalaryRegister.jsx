/* Payroll -> Run Payroll -> Salary Register (the per-run pay list).
 *
 * Source spec : modules/payroll/specs/run_payroll_salary_register.listing.md
 * Source DOM  : modules/payroll/dom/run_payroll_salary_register.html
 * Every class string below is PASTED from that capture. Per-column min-w and the
 * per-column amount colour (success / error / indigo / gray-800) are read off the
 * captured row, not chosen.
 *
 * THE TRAP on this screen: the first column is
 *   `sticky left-0 bg-white group-hover:bg-gray-50 drop-shadow-md border-r`
 * It paints its OWN background, so a tint set on <tr> never reaches it and the
 * frozen column stays white against a tinted row. It is tinted explicitly below.
 */
import register from '../fixtures/payroll-salary-register.json'
import { initials } from '../components/primitives'
import IncognitoIcon from '../components/IncognitoIcon'

/* copied from the captured row, index-aligned to `columns` */
const COLS = [
  { w: '200px', c: null },
  { w: '140px', c: 'text-success-600' }, { w: '140px', c: 'text-success-600' },
  { w: '140px', c: 'text-success-600' }, { w: '140px', c: 'text-success-600' },
  { w: '140px', c: 'text-success-600' }, { w: '140px', c: 'text-success-600' },
  { w: '140px', c: 'text-success-600' },
  { w: '140px', c: 'text-error-600' }, { w: '140px', c: 'text-error-600' },
  { w: '140px', c: 'text-error-600' }, { w: '140px', c: 'text-error-600' },
  { w: '140px', c: 'text-error-600' },
  { w: '140px', c: 'text-indigo-600' }, { w: '140px', c: 'text-indigo-600' },
  { w: '140px', c: 'text-indigo-600' }, { w: '140px', c: 'text-indigo-600' },
  { w: '120px', c: 'text-gray-800' },
  { w: '140px', c: 'text-error-600' },
  { w: '110px', c: 'text-gray-800' },
  { w: '120px', c: 'text-gray-800' },
]

const TH_BASE =
  '2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:px-6 2xl-to-xl:px-4 px-4 whitespace-nowrap 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-gray-600 text-left bg-gray-50 top-0'
const TD_BASE =
  'whitespace-nowrap 2xl:px-6 2xl-to-xl:px-4 px-4 2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-600 text-left'
const PILL =
  'rounded-2xl border flex w-max font-medium items-center border-success-200 bg-success-50 text-success-700 2xl-to-xl:!text-xxs !text-xxs !px-1.5 2xl:!text-[10px] 2xl-to-xl:!text-[10px] !text-[10px] 2xl:!py-0 2xl-to-xl:!py-0 !py-0 py-0.5 px-2 text-xs'
const BTN_SECONDARY =
  'outline-none rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 px-4 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs bg-white border-gray-300 text-gray-700 font-semibold enabled:hover:!bg-gray-50'
const PAGE_BTN =
  'inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0'

const shortName = (n) => {
  const [f, ...r] = n.split(' ')
  return r.length ? `${f} ${r[r.length - 1][0]}.` : f
}

export default function PayrollSalaryRegister() {
  const rows = register.rows
  const hiddenCount = rows.filter((r) => r.is_hidden).length

  return (
    <>
      {/* toolbar */}
      <div className="2xl:py-4 2xl:px-5 2xl-to-xl:py-2 py-2 2xl-to-xl:px-3 px-3 bg-white sticky top-0 z-2 border rounded-tl-lg rounded-tr-lg border-gray-200 border-b">
        <div className="flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3 min-w-0">
            <p className="font-semibold text-gray-900 2xl:text-lg 2xl-to-xl:text-base text-base">Salary Adjustments</p>
            <div className="rounded-2xl border flex w-max font-medium items-center border-indigo-200 bg-indigo-50 text-indigo-700 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs py-0.5 px-2 text-xs">
              <span>
                <span className="font-bold">1&nbsp;-&nbsp;{rows.length}</span>
                <span className="font-medium"> of {rows.length} Employees</span>
              </span>
            </div>
            {hiddenCount > 0 && (
              <div
                data-change="NEW"
                className="rounded-2xl border flex w-max font-medium items-center border-warning-200 bg-warning-50 text-warning-700 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs py-0.5 px-2 text-xs gap-x-1.5"
                title="Hidden profiles are paid like anyone else. They are excluded from headcount reports, not from payroll."
              >
                <IncognitoIcon className="size-3.5" />
                <span>Includes {hiddenCount} hidden {hiddenCount === 1 ? 'profile' : 'profiles'}</span>
              </div>
            )}
          </div>
          <button type="button" className={BTN_SECONDARY}>
            <div className="flex items-center justify-center gap-2">
              <i className="icon-file-export" />Export Salary Register
            </div>
          </button>
        </div>
      </div>

      {/* table */}
      <div className="z-0 relative">
        <div className="flex flex-col">
          <div className="inline-block w-full align-middle">
            <div className="sidebar-container border overflow-auto scrollbar-hide z-0 relative border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 tableSticky">
                <thead>
                  <tr>
                    {register.columns.map((c, n) => (
                      <th
                        key={c}
                        scope="col"
                        className={
                          n === 0
                            ? `${TH_BASE} sticky left-0 !z-10`
                            : `${TH_BASE} min-w-[${COLS[n].w}]`
                        }
                      >
                        <div className="">{c}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA] bg-white">
                  {rows.map((r) => {
                    const hoverProps = r.is_hidden
                      ? { title: 'Hidden profile — an Internal & Payroll profile, not counted in headcount and not visible across other portals' }
                      : {}
                    return (
                      <tr
                        key={r.employee_code}
                        className={`h-[65px] group ${r.is_hidden ? 'bg-warning-25 hover:bg-warning-50' : 'hover:bg-gray-50'}`}
                      >
                        <td
                          /* class order matches the captured cell exactly; only the two
                             bg tokens swap, and only on a hidden row */
                          className={`${TD_BASE} min-w-[200px] sticky left-0 ${
                            r.is_hidden
                              ? 'bg-warning-25 group-hover:bg-warning-50'
                              : 'bg-white group-hover:bg-gray-50'
                          } drop-shadow-md border-r`}
                          {...hoverProps}
                        >
                          <div className="flex items-center gap-x-3">
                            <p className="text-gray-900 max-w-[160px] truncate font-medium line-clamp1 min-w-[30px]">{r.no}</p>
                            <span className="flex items-center gap-x-3 min-w-0" title={r.employee_name}>
                              <div className="rounded-full overflow-hidden 2xl:h-8 h-8 2xl:w-8 w-8">
                                <div className="rounded-full flex items-center justify-center bg-primary-500 2xl:h-8 h-8 2xl:w-8 w-8">
                                  <span className="font-medium text-white uppercase 2xl:text-sm 2xl-to-xl:text-xs text-xs">{initials(r.employee_name)}</span>
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-x-1.5">
                                  <p className="2xl:text-sm text-xs font-semibold text-gray-900 truncate">
                                    {shortName(r.employee_name)} ({r.employee_code})
                                  </p>
                                  {r.is_hidden && (
                                    <span data-change="NEW" className="shrink-0">
                                      <IncognitoIcon className="2xl:size-4 size-3.5 text-warning-600" />
                                    </span>
                                  )}
                                </div>
                                <div className={PILL}>Confirmed</div>
                              </div>
                            </span>
                          </div>
                        </td>
                        {r.amounts.map((a, n) => (
                          <td key={n} className={`${TD_BASE} min-w-[${COLS[n + 1].w}]`} {...hoverProps}>
                            <span className={`2xl:text-sm text-xs font-medium ${COLS[n + 1].c}`}>{a}</span>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* pagination */}
      <div className="bg-white 2xl:px-5 2xl:py-3 2xl:pb-4 2xl-to-xl:p-2 p-2 border border-t-0 rounded-bl-lg rounded-br-lg responsive-dropdown">
        <div className="flex space-x-2 justify-between">
          <div className="flex justify-center items-center gap-3">
            <p className="text-gray-700 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium">
              <span className="sm:inline hidden">Records</span> Per Page
            </p>
            <div className="text-bold 2xl:text-sm 2xl-to-xl:text-xs text-xs border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700">25</div>
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button disabled className={`rounded-l-lg ${PAGE_BTN}`}>
              <span className="icon-arrow-narrow-left text-xl me-2" /> <span className="sm:block hidden">Previous</span>
            </button>
            <button className="inline-flex items-center bg-indigo-600 text-white px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">1</button>
            <button disabled className={`rounded-r-lg relative ${PAGE_BTN}`}>
              <span className="sm:block hidden">Next</span><span className="icon-arrow-narrow-right text-xl ms-2" />
            </button>
          </nav>
        </div>
      </div>

      {/* wizard footer */}
      <div className="bg-white 2xl:py-3 2xl:px-5 2xl-to-xl:py-2 py-2 2xl-to-xl:px-3 px-3 flex flex-col md:flex-row items-center w-full border-t border-gray-200 justify-end gap-x-2">
        <button type="button" className={BTN_SECONDARY}>
          <div className="flex items-center justify-center gap-2"><i className="icon-arrow-narrow-left text-sm" />Back</div>
        </button>
        <span className="inline-flex">
          <button type="button" className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs">
            <div className="flex items-center justify-center gap-2">Next<i className="icon-arrow-narrow-right text-sm" /></div>
          </button>
        </span>
      </div>
    </>
  )
}
