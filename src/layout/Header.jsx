/* Copied from modules/people/dom/employee_listing.html (crawled 2026-09-21).
   Every class string here is pasted from that dump. */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { peoplePath } from '../lib/tenant'
import { getShowChanges, setShowChanges } from '../lib/changes'

export default function Header() {
  const [changes, setChanges] = useState(getShowChanges)
  const toggleChanges = () => { const v = !changes; setChanges(v); setShowChanges(v) }
  return (
    <div className="sticky top-0 z-[60] 2xl:h-[60px] 2xl-to-xl:h-[52px] h-[52px] border-b border-gray-200 bg-white shadow-sm ">
      <div className="flex items-center relative">
        {/* portal switcher */}
        <div className="relative group/main">
          <div className="flex items-center justify-center box-border 2xl:h-[60px] 2xl-to-xl:h-[52px] h-[52px] w-[65px] cursor-pointer border-r-[1px] border-gray-200 pl-2.5 pr-3 py-3">
            <span className="icon-dots-grid text-gray-600 2xl:text-2xl 2xl-to-xl:text-xl text-xl" />
          </div>
        </div>

        <div className="2xl:px-6 2xl-to-xl:px-4 2xl-to-xl:pr-2 px-4 pr-2 flex items-center w-full justify-between">
          <div className="flex items-center gap-x-11">
            <div className="flex">
              <img src="/collabcrm/assets/logo.svg" alt="people" className="h-5" />
              <span className="ml-2 text-gray-500 2xl:text-base 2xl-to-xl:text-sm text-sm font-normal leading-tight capitalize w-full">
                people
              </span>
            </div>
            <div className="border-[#FF0000] bg-[#FF0000] text-white font-extrabold 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:h-10 2xl-to-xl:h-8 h-8 px-4 rounded-lg 2xl:text-base 2xl-to-xl:text-sm text-sm flex items-center justify-center">
              STAGING
            </div>
            {/* PROTOTYPE-ONLY control. Not part of CollabCRM — it exists so a
                reviewer can see what this ticket changes against the copied
                product. Off by default. */}
            <button
              type="button"
              onClick={toggleChanges}
              title="Outline everything this ticket changes"
              className={`inline-flex items-center gap-2 rounded-lg border font-semibold 2xl:h-10 2xl-to-xl:h-8 h-8 px-3 2xl:text-sm 2xl-to-xl:text-xs text-xs transition-colors ${
                changes
                  ? 'border-[#6941C6] bg-[#6941C6] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block size-2 rounded-full ${changes ? 'bg-white' : 'bg-[#6941C6]'}`} />
              Show changes
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 2xl-to-xl:gap-3 2xl:gap-4">
            <button
              type="button"
              id="searchKey"
              aria-label="Open command palette"
              title="Click to open global search bar (Ctrl/Cmd K)"
              className="group relative inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 font-semibold text-indigo-700 transition-colors hover:border-indigo-300 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:min-w-10 2xl-to-xl:min-w-8 min-w-8 2xl:px-3 2xl-to-xl:px-2.5 px-2.5"
            >
              <span className="inline-flex items-center justify-center transition-opacity group-hover:pointer-events-none group-hover:opacity-0">
                <span className="icon-search-md text-base" />
              </span>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-0.5 text-[11px] font-medium leading-none text-indigo-700 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="icon-command text-xs" />
                <span>K</span>
              </span>
            </button>

            <div className="relative">
              <div className="group/new relative">
                <button
                  type="submit"
                  className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:px-4 2xl-to-xl:px-3 px-3 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <p>New</p>
                      <span className="icon-chevron-down block text-xl" />
                    </div>
                  </div>
                </button>
                <div className="hidden group-hover/new:block absolute right-0 z-10 mt-1.5 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <div className="2xl:text-sm 2xl-to-xl:text-xs text-xs whitespace-nowrap hover:bg-gray-100">
                    <Link
                      className="flex gap-2 items-center px-4 py-2 2xl:text-sm 2xl-to-xl:text-xs text-xs whitespace-nowrap"
                      to={peoplePath('/employee/add')}
                    >
                      <span className="icon-plus" />Add Employee
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <button className="cursor-pointer rounded-lg border 2xl:w-10 2xl:h-10 2xl-to-xl:w-8 2xl-to-xl:h-8 w-8 h-8 flex items-center justify-center outline-none border-gray-300">
              <span className="2xl:text-xl 2xl-to-xl:text-lg text-lg block text-gray-700 icon-check-square" />
            </button>
            <button className="cursor-pointer rounded-lg border 2xl:w-10 2xl:h-10 2xl-to-xl:w-8 2xl-to-xl:h-8 w-8 h-8 flex items-center justify-center outline-none border-gray-300">
              <span className="2xl:text-xl 2xl-to-xl:text-lg text-lg block text-gray-700 icon-bell-01" />
            </button>
            <button className="flex items-center 2xl:text-sm 2xl-to-xl:text-xs text-xs">
              <div className="rounded-full overflow-hidden 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:w-9 2xl-to-xl:w-8 w-8">
                <div className="rounded-full flex items-center justify-center bg-primary-500 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:w-9 2xl-to-xl:w-8 w-8">
                  <span className="font-medium text-white uppercase 2xl:text-sm 2xl-to-xl:text-xs text-xs">SU</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
