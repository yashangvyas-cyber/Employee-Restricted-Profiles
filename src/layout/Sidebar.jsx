/* Sidebar + sub-sidebar flyout.
 *
 * Scope per the brief: the main sidebar shows ONLY "Employees" and the
 * sub-sidebar shows ONLY "Employee List".
 *
 * ADDED 2026-09-22 on request: a second item, "Hidden Profile Map", below
 * Employees. It is INVENTED - CollabCRM has no such nav entry - and it opens the
 * prototype-only visibility map. The <li>/icon/label markup is the copied
 * Employees item with its own label, so it matches the real nav exactly.
 *
 * Source: modules/people/dom/employee_listing.html (sidebar) and
 *         modules/people/dom/employee_subsidebar_flyout.html (the open flyout).
 *
 * The flyout would not open from synthetic mouse events in headless Chrome; it
 * was opened by invoking the <li>'s own React onClick prop through the fiber,
 * so the markup below is COPIED, not reconstructed - panel, close button,
 * heading, <ul>, <li>, the item link and the trailing "add" link.
 */
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { peoplePath } from '../lib/tenant'
import { DEFAULT_FILTER_QUERY } from '../api/endpoints'

/* The real "Employee List" href carries this default filter - which is why the
   listing opens with two chips already applied. */
const EMPLOYEE_LIST_HREF =
  peoplePath('/employee') + '?filterQuery=' + encodeURIComponent(JSON.stringify(DEFAULT_FILTER_QUERY))

const IMPACT_HREF = peoplePath('/hidden-profile-map')

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onEmployees = pathname.includes('/employee')
  const onImpact = pathname.includes('/hidden-profile-map')

  return (
    <div className="">
      <div className="bg-indigo-700 w-[220px] duration-300 relative 2xl:min-h-[calc(100vh-60px)] 2xl-to-xl:min-h-[calc(100vh-52px)] min-h-[calc(100vh-52px)]">
        <nav className="py-5 px-2 overflow-y-auto overflow-x-hidden sidebar-container 2xl:h-[calc(100vh-116px)] 2xl-to-xl:h-[calc(100vh-108px)] h-[calc(100vh-108px)]">
          <ul className="space-y-3 sidebar-container">
            <li
              title="Employees"
              className="relative group cursor-pointer"
              onMouseEnter={() => setOpen(true)}
              onClick={() => setOpen((v) => !v)}
            >
              <div
                className={
                  'text-white hover:bg-indigo-600 relative z-2 cursor-pointer flex items-center gap-x-3 rounded-md 2xl:p-3 2xl-to-xl:p-2 p-2 text-sm leading-6 font-semibold whitespace-nowrap' +
                  (onEmployees ? ' bg-indigo-800' : '')
                }
              >
                <span className="text-indigo-200 group-hover:text-white h-6 w-6 shrink-0 whitespace-nowrap flex items-center justify-center text-base 2xl-to-xl:text-base 2xl:text-xl icon-users-02" />
                <p>Employees</p>
                <span className="icon-chevron-right block ml-auto text-xl text-indigo-300" />
              </div>
            </li>
            <li title="Hidden Profile Map" className="relative group cursor-pointer" data-change="NEW">
              <Link
                to={IMPACT_HREF}
                onMouseEnter={() => setOpen(false)}
                className={
                  'text-white hover:bg-indigo-600 relative z-2 cursor-pointer flex items-center gap-x-3 rounded-md 2xl:p-3 2xl-to-xl:p-2 p-2 text-sm leading-6 font-semibold whitespace-nowrap' +
                  (onImpact ? ' bg-indigo-800' : '')
                }
              >
                <span className="text-indigo-200 group-hover:text-white h-6 w-6 shrink-0 whitespace-nowrap flex items-center justify-center text-base 2xl-to-xl:text-base 2xl:text-xl icon-eye-off" />
                <p>Hidden Profile Map</p>
              </Link>
            </li>
          </ul>
        </nav>

        {/* sub-sidebar flyout — markup copied from employee_subsidebar_flyout.html */}
        <div
          className={
            'z-[51] bg-gray-50 absolute top-0 duration-300 overflow-hidden shadow-md whitespace-nowrap left-[220px] 2xl:h-[calc(100vh-60px)] 2xl-to-xl:h-[calc(100vh-52px)] h-[calc(100vh-52px)] ' +
            (open ? 'w-[260px]' : 'w-[0px]')
          }
          onMouseLeave={() => setOpen(false)}
        >
          <div className="absolute 2xl-to-xl:top-4 top-4 2xl:right-8 2xl-to-xl:right-3.5 right-3.5 flex justify-end w-full">
            <div
              role="button"
              className="relative rounded-lg group before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:bg-gray-100 hover:before:scale-150 before:rounded-sm hover:before:opacity-100 before:opacity-0 before:transition-all before:duration-300"
              onClick={() => setOpen(false)}
            >
              <span className="relative icon icon-x-close flex text-lg text-gray-600 group-hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
          <div className="2xl:p-5 2xl-to-xl:p-3 p-3 2xl:h-[calc(100vh-60px)] 2xl-to-xl:h-[calc(100vh-52px)] h-[calc(100vh-52px)] overflow-auto">
            <h3 className="text-black font-medium 2xl:text-base 2xl-to-xl:text-sm text-sm capitalize">employees</h3>
            <ul className="mt-4">
              <li className="2xl:px-3 2xl-to-xl:pl-1 pl-1 2xl:py-2 2xl-to-xl:py-1.5 py-1.5 flex items-center justify-between">
                <Link
                  title="Employee List"
                  className="flex items-center cursor-pointer w-full"
                  to={EMPLOYEE_LIST_HREF}
                  onClick={() => setOpen(false)}
                >
                  <p className="text-gray-600 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold text-nowrap ">Employee List</p>
                </Link>
                <Link
                  className="flex items-center cursor-pointer"
                  title="Add Employee"
                  to={peoplePath('/employee/add')}
                  onClick={() => setOpen(false)}
                >
                  <span className="icon-plus-square block ml-auto 2xl:text-xl 2xl-to-xl:text-lg text-lg text-gray-800" />
                  <div />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="group flex items-center py-[18px] px-8 gap-x-2 text-sm leading-6 font-semibold whitespace-nowrap bg-indigo-800 text-indigo-200 cursor-pointer justify-start">
          <span className="icon-chevron-left-double text-xl text-white block text-indigo-300" />
          <p className="text-sm font-medium text-white">Collapse</p>
        </div>
      </div>
    </div>
  )
}
