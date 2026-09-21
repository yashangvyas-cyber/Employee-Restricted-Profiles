/* COPIED from modules/people/dom/employee_listing.html.
   Clicking a page sends POST /v1/employee/list {"page":N,"per_page":10}
   - VERIFIED (page 2 request body read off the wire). */

export default function Pagination({ page, perPage, total, onPage, onPerPage }) {
  const last = Math.max(1, Math.ceil(total / perPage))
  const pages = Array.from({ length: last }, (_, i) => i + 1)
  const btn =
    'inline-flex items-center text-gray-700 hover:bg-gray-50 px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0'
  const active =
    'inline-flex items-center bg-indigo-600 text-white px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0'

  return (
    <div className="bg-white 2xl:px-5 2xl:py-3 2xl:pb-4 2xl-to-xl:p-2 p-2 border border-t-0 rounded-bl-lg rounded-br-lg responsive-dropdown">
      <div className="flex space-x-2 justify-between">
        <div className="flex justify-center items-center gap-3">
          <p className="text-gray-700 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium">
            <span className="sm:inline hidden">Records</span> Per Page
          </p>
          <select
            className="text-bold 2xl:text-sm 2xl-to-xl:text-xs text-xs rounded-lg border border-gray-300 px-2 2xl:h-9 h-8 bg-white outline-none"
            value={perPage}
            onChange={(e) => onPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            disabled={page === 1}
            onClick={() => onPage(page - 1)}
            className="rounded-l-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
          >
            <span className="icon-arrow-narrow-left text-xl me-2" /> <span className="sm:block hidden">Previous</span>
          </button>
          {pages.map((n) => (
            <button key={n} className={n === page ? active : btn} onClick={() => onPage(n)}>{n}</button>
          ))}
          <button
            disabled={page === last}
            onClick={() => onPage(page + 1)}
            className="rounded-r-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 px-4 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
          >
            <span className="sm:block hidden">Next</span> <span className="icon-arrow-narrow-right text-xl ms-2" />
          </button>
        </nav>
      </div>
    </div>
  )
}
