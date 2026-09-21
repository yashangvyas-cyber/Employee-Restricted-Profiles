/* The listing's filter bar - this IS the "search" on this screen.
 *
 * Behaviour, all VERIFIED against staging on 2026-09-21:
 *  - There is no free-text search box on the listing. The only text input is
 *    "Filter Results...", which searches the FIELD LIST, not the employees.
 *  - Flow: click the box -> pick a field -> pick an operator -> enter a value
 *    -> press "Filter". Nothing is requested until "Filter" is pressed, so
 *    there is no debounce and no search-as-you-type.
 *  - Pressing Filter sends POST /v1/employee/list with
 *      {"page":1,"per_page":10,"filters":[{field_name,operator,value}]}
 *    and writes ?filterQuery=<same array, url-encoded> into the address bar.
 *
 * Markup COPIED from modules/people/dom/employee_listing.html and
 * employee_listing_filter_fields.html.
 */
import { useMemo, useRef, useState } from 'react'
import { FILTER_FIELDS } from '../api/endpoints'

/** URL-loaded chips carry only field_name/operator/value; recover the label. */
const labelFor = (fn) => FILTER_FIELDS.find((f) => f.field_name === fn)?.label || fn
const iconFor = (fn) => FILTER_FIELDS.find((f) => f.field_name === fn)?.icon || 'icon-check-verified-02'

export default function FilterBar({ chips, onApply, onRemoveChip, onClearAll }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState(null) // {field, operator, value}
  const valueRef = useRef(null)

  const fields = useMemo(
    () => FILTER_FIELDS.filter((f) => f.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const canApply = draft && draft.operator && String(draft.value ?? '').trim() !== ''

  const apply = () => {
    if (!canApply) return
    onApply({
      label: draft.field.label,
      field_name: draft.field.field_name,
      operator: draft.operator,
      value: draft.value,
    })
    setDraft(null); setQuery(''); setOpen(false)
  }

  return (
    <div className="bg-gray-200 sticky 2xl:top-[70px] 2xl-to-xl:top-[54px] top-[54px] z-1 border-l border-r">
      <form
        className="relative z-0 flex gap-2 p-2 border-x border-gray-200 responsive-filter"
        onSubmit={(e) => { e.preventDefault(); apply() }}
      >
        {/* saved-view sigma control */}
        <div className="flex items-center filter-option-menu text-sm rounded-lg border border-gray-300 p-[1px] focus:ring-indigo-700 text-gray-800 bg-white max-h-[42px]">
          <div className="border-none w-[45px] px-0.5 2xl:text-sm 2xl-to-xl:text-xs text-xs flex items-center justify-center">
            <span className="icon-sigma text-indigo-700 text-[15px]" />
            <span className="icon-chevron-down pe-0.5 text-[17px]" />
          </div>
        </div>

        <div className="text-sm rounded-lg border border-gray-300 p-1 focus:ring-indigo-700 text-gray-800 bg-white flex w-full">
          <div className="flex w-full flex-wrap">
            <div className="flex gap-2 flex-wrap flex-grow pr-12 items-center">
              {/* applied chips */}
              {chips.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs"
                >
                  <span className={`${iconFor(c.field_name)} text-gray-500`} />
                  <span className="font-medium text-gray-700">{c.label || labelFor(c.field_name)}</span>
                  <span className="text-gray-500">{c.operator}</span>
                  <span className="font-medium text-gray-900">{String(c.value)}</span>
                  <span
                    className="icon-x-close cursor-pointer text-gray-400 hover:text-gray-600 ms-1"
                    onClick={() => onRemoveChip(i)}
                  />
                </div>
              ))}

              {/* draft being built */}
              {draft && (
                <div className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs">
                  <span className={`${draft.field.icon} text-gray-600`} />
                  <span className="font-medium text-gray-700">{draft.field.label}</span>
                  {!draft.operator ? (
                    draft.field.operators.map((op) => (
                      <button
                        type="button"
                        key={op}
                        className="rounded px-1.5 py-0.5 hover:bg-indigo-100 text-indigo-700 font-medium"
                        onClick={() => setDraft({ ...draft, operator: op })}
                      >
                        {op}
                      </button>
                    ))
                  ) : (
                    <>
                      <span className="text-gray-500">{draft.operator}</span>
                      <input
                        ref={valueRef}
                        autoFocus
                        className="w-full 2xl:p-[7px] 2xl-to-xl:p-1 p-1 2xl:text-sm 2xl-to-xl:text-xs text-xs outline-none bg-transparent min-w-[90px]"
                        placeholder="Search..."
                        value={draft.value ?? ''}
                        onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                      />
                    </>
                  )}
                  <span
                    className="icon-x-close cursor-pointer text-gray-400 hover:text-gray-600 ms-1"
                    onClick={() => setDraft(null)}
                  />
                </div>
              )}

              {!draft && (
                <div className="rounded-md flex-grow flex">
                  <div className="flex items-center w-full">
                    <div className="w-full">
                      <div className="w-full h-full flex items-start">
                        <div className="flex items-center w-full">
                          <span className="icon-search-lg text-xl text-gray-400 ms-2 me-1" />
                          <input
                            type="text"
                            className="w-full 2xl:p-[7px] 2xl-to-xl:p-1 p-1 2xl:text-sm 2xl-to-xl:text-xs text-xs outline-none"
                            placeholder="Filter Results..."
                            value={query}
                            onFocus={() => setOpen(true)}
                            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                          />
                        </div>
                      </div>

                      {/* field picker */}
                      <div className={open ? 'transition-opacity duration-500' : 'transition-opacity duration-500 scale-0 opacity-0'}>
                        <ul className="absolute z-10 mt-2.5 left-0 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none max-h-[300px] overflow-y-auto">
                          {fields.map((f) => (
                            <li
                              key={f.label}
                              className="cursor-pointer 2xl:min-w-[260px] 2xl-to-xl:min-w-[200px] min-w-[200px] 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium whitespace-nowrap 2xl:px-3 2xl-to-xl:px-2.5 px-2.5 2xl:py-2 2xl-to-xl:py-1.5 py-1.5 hover:bg-gray-100"
                              onClick={() => { setDraft({ field: f, operator: null, value: '' }); setOpen(false) }}
                            >
                              <span>
                                <div className="flex items-center">
                                  <span className={`${f.icon} text-gray-600 2xl:text-lg 2xl-to-xl:text-base text-base pe-2`} />
                                  <span>{f.label}</span>
                                </div>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {chips.length > 0 && (
            <span
              className="icon-x-close cursor-pointer text-gray-400 hover:text-gray-600 self-center px-2"
              onClick={onClearAll}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!canApply}
          className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed disabled:opacity-100 py-2.5 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-400 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:min-h-[42px] 2xl-to-xl:min-h-10 min-h-10 flex justify-center items-center"
        >
          Filter
        </button>
      </form>
    </div>
  )
}
