/* COPIED from modules/people/dom/employee_listing.html - the <nav>/<ol> and the
   per-crumb button classes are the app's own. */
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex border-b border-gray-200 py-2 px-6 bg-white items-center justify-between">
      <ol className="flex items-center space-x-2 overflow-x-auto flex-nowrap no-scrollbar scrollbar-hide sm:flex-wrap">
        <li className="">
          <span className="icon-home-line text-gray-500 2xl:text-lg 2xl-to-xl:text-base text-base" />
        </li>
        {items.map((c, i) => (
          <li className="" key={c.label ?? i}>
            <div className="flex items-center">
              <span className="icon-chevron-right text-gray-300 text-base" />
              {c.to && i !== items.length - 1 ? (
                <Link
                  className="text-gray-600 cursor-pointer hover:text-gray-800 ml-4 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium sm:whitespace-normal whitespace-nowrap"
                  to={c.to}
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={
                    (i === items.length - 1 ? 'text-indigo-700' : 'text-gray-600') +
                    ' cursor-default pointer-events-none ml-4 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium sm:whitespace-normal whitespace-nowrap'
                  }
                >
                  {c.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
