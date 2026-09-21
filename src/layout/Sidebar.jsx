/* Sidebar + sub-sidebar flyout.
 *
 * Scope per the brief: the main sidebar shows ONLY "Employees" and the
 * sub-sidebar shows ONLY "Employee List".
 *
 * Sources:
 *  - main sidebar, the "Employees" <li> and its icon (icon-users-02):
 *    COPIED from modules/people/dom/employee_listing.html
 *  - flyout panel wrapper, heading and <ul>: COPIED from the same dump
 *    (it ships collapsed at w-[0px]; the classes are real, the items are not
 *     rendered until it opens)
 *  - the label "Employee List": from the app's own route table
 *    (_build/route_table.json -> name "Employee List", path /employee) and the
 *    user's screenshot. The flyout's per-item markup could NOT be captured
 *    headlessly - see GAPS.md.
 */
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { peoplePath } from '../lib/tenant'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onEmployees = pathname.includes('/employee')

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
          </ul>
        </nav>

        {/* sub-sidebar flyout */}
        <div
          className={
            'z-[51] bg-gray-50 absolute top-0 duration-300 overflow-hidden shadow-md whitespace-nowrap left-[220px] 2xl:h-[calc(100vh-60px)] 2xl-to-xl:h-[calc(100vh-52px)] h-[calc(100vh-52px)] ' +
            (open ? 'w-[262px]' : 'w-[0px]')
          }
          onMouseLeave={() => setOpen(false)}
        >
          <div className="absolute 2xl-to-xl:top-4 top-4 2xl:right-8 2xl-to-xl:right-3.5 right-3.5 flex justify-end w-full">
            <div className="relative rounded-lg group before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:bg-gray-100 hover:before:scale-150 before:rounded-sm hover:before:opacity-100 before:opacity-0 before:transition-all before:duration-300">
              <span
                className="icon-x-close relative z-10 text-xl text-gray-500 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="2xl:p-5 2xl-to-xl:p-3 p-3 2xl:h-[calc(100vh-60px)] 2xl-to-xl:h-[calc(100vh-52px)] h-[calc(100vh-52px)] overflow-auto">
            <h3 className="text-black font-medium 2xl:text-base 2xl-to-xl:text-sm text-sm capitalize">Employees</h3>
            <ul className="mt-4">
              <li className="cursor-pointer hover:bg-gray-100 rounded-md group bg-white">
                <Link
                  className="flex w-full items-center gap-x-3 2xl:p-3 2xl-to-xl:p-2 p-2 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-gray-700"
                  to={peoplePath('/employee')}
                  onClick={() => setOpen(false)}
                >
                  Employee List
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
