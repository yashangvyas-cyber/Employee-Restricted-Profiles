/* Add/Edit form building blocks. Every class string is pasted from
   modules/people/dom/employee_add_2026-09-21.html. */
import { VALIDATION } from '../api/endpoints'
import { INPUT, TEXTAREA } from './primitives'

/** Section: title+description in a left gutter, fields in a card on the right. */
export function Section({ id, title, desc, first, children }) {
  return (
    <div id={id} className={first ? 'flex' : 'flex items-start 2xl:mt-4 mt-3'}>
      <div className="2xl:w-1/4 2xl-to-xl:w-[20%] w-[20%] pr-2">
        <div className="flex items-center min-h-6">
          <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium">
            <span className="">{title}</span>
          </p>
        </div>
        <p className="text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs mt-1 max-w-[80%] w-full">{desc}</p>
      </div>
      <div className="2xl:w-3/4 2xl-to-xl:w-[80%] w-[80%]">
        <div className="2xl:p-6 2xl:pb-4 p-4 pb-2.5 bg-white border border-gray-200 rounded-lg">{children}</div>
      </div>
    </div>
  )
}

export const GRID = 'grid grid-cols-3 gap-x-3'
export const GRID_TOP = '2xl:pt-6 pt-4 grid grid-cols-3 gap-x-3 '

export function FieldError({ msg }) {
  if (!msg) return null
  return <div className={VALIDATION.errorClass}>{msg}</div>
}

/** Label row: label then a separate red asterisk span, as the app renders it. */
export function LabelRow({ children, required, info }) {
  return (
    <div>
      <div className="flex items-end min-h-6">
        <label className="label">{children}&nbsp;</label>
        {required && <span className="text-error-500 pe-1">*</span>}
        {info && <span className="icon-info-circle text-gray-400 text-sm" title={info} />}
      </div>
      <div />
    </div>
  )
}

/** Date field. The app labels these with <span class="label"> inside
 *  <div class="relative z-5">, not with a <label> — copied from the Add DOM. */
export function DateField({ label, required, info, name, value, onChange, error, span }) {
  return (
    <div className={`relative z-5${span ? ` col-span-${span}` : ''}`}>
      <div className="mb-1.5 flex items-end min-h-6">
        <span className={`label${info ? ' mr-1' : ''}`}>{label}</span>
        {required && <span className="text-error-500 pe-1">*</span>}
        {info && <span className="icon-info-circle text-gray-400 text-sm" title={info} />}
      </div>
      <input
        className={INPUT}
        type="date"
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
      />
      <FieldError msg={error} />
    </div>
  )
}

export function Text({ label, required, info, name, value, onChange, type = 'text', placeholder, error, span }) {
  return (
    <div className={span ? `col-span-${span}` : undefined}>
      <LabelRow required={required} info={info}>{label}</LabelRow>
      <div className="rounded-lg relative mt-1.5">
        <input
          className={INPUT}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
      <FieldError msg={error} />
    </div>
  )
}

export function Select({
  label, required, info, name, value, onChange, options, error, span,
  getLabel = (o) => o.title || o.name || o.label, getValue = (o) => o.id,
}) {
  return (
    <div className={span ? `col-span-${span}` : undefined}>
      <LabelRow required={required} info={info}>{label}</LabelRow>
      <div className="rounded-lg relative mt-1.5">
        <select className={INPUT} name={name} value={value ?? ''} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">Select</option>
          {(options || []).map((o) => (
            <option key={getValue(o)} value={getValue(o)}>{getLabel(o)}</option>
          ))}
        </select>
      </div>
      <FieldError msg={error} />
    </div>
  )
}

/** Phone field: flag/dial-code box then the number, as the app lays it out. */
export function Phone({ label, required, name, value, onChange, code = '+91', error, span }) {
  return (
    <div className={span ? `col-span-${span}` : undefined}>
      <LabelRow required={required}>{label}</LabelRow>
      <div className="rounded-lg relative mt-1.5 flex">
        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-white px-2 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700">
          🇮🇳 <span className="ms-1">{code}</span>
        </span>
        <input
          className={`${INPUT} rounded-l-none`}
          type="tel"
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
      <FieldError msg={error} />
    </div>
  )
}

export function TextArea({ label, required, name, value, onChange, error, counter, max }) {
  return (
    <div className="col-span-3">
      <div className="flex items-end min-h-6 justify-between">
        <div className="flex items-end">
          <label className="label">{label}&nbsp;</label>
          {required && <span className="text-error-500 pe-1">*</span>}
        </div>
        {counter && <span className="text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs">{(value || '').length}/{max}</span>}
      </div>
      <div className="rounded-lg relative mt-1.5">
        <textarea className={TEXTAREA} name={name} maxLength={max} value={value ?? ''} onChange={(e) => onChange(name, e.target.value)} />
      </div>
      <FieldError msg={error} />
    </div>
  )
}

/** Pill toggle — used by Timesheet Filling, Account Status and Invite Employee. */
export function Toggle({ id, checked, onChange, title, desc }) {
  return (
    <div className="flex items-start">
      <span>
        <div className="">
          <div className="relative inline-block 2xl:w-[38px] 2xl-to-xl:w-[35px] w-[35px] 2xl:h-[21px] 2xl-to-xl:h-[17px] h-[17px]">
            <input type="checkbox" id={id} className="hidden" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
            <label
              htmlFor={id}
              className={`flex items-center w-full h-full rounded-full transition-colors duration-300 cursor-pointer ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block 2xl:size-[14px] 2xl-to-xl:size-3 size-3 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform ${checked ? 'translate-x-[20px]' : 'translate-x-[3px]'}`}
              />
            </label>
          </div>
        </div>
      </span>
      <div className="ml-3">
        <p className="text-gray-700 font-medium 2xl:text-base 2xl-to-xl:text-sm text-sm">{title}</p>
        {desc && <p className="text-gray-600 font-normal 2xl:text-sm 2xl-to-xl:text-xs text-xs">{desc}</p>}
      </div>
    </div>
  )
}

export const CHECKBOX_CLS =
  'border border-gray-300 rounded 2xl:!size-4 2xl-to-xl:!size-3.5 !size-3.5 2xl:!min-h-4 2xl:!min-w-4 2xl-to-xl:!min-h-3.5 !min-h-3.5 2xl-to-xl:!min-w-3.5 !min-w-3.5 focus:border-indigo-300 focus:shadow-outline-purple after:!bg-cover 2xl:after:!size-2.5 2xl-to-xl:after:!size-1.5 after:!size-1.5 tick-checkbox !h-1 !w-1'

export function Check({ name, id, checked, onChange, children }) {
  return (
    <div className="2xl:p-4 2xl-to-xl:p-3 p-3">
      <div className="flex items-center gap-2">
        <input type="checkbox" className={CHECKBOX_CLS} name={name} id={id} checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <label className="text-gray-900 py-0.5 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal cursor-pointer" htmlFor={id}>
              {children}&nbsp;
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Typeahead: a text input backed by a <datalist>. The app renders "Reporting
 *  to" as a searchable TEXT input, not a dropdown — a <datalist> keeps the
 *  control type identical while still letting you pick a real person. */
export function Typeahead({ label, required, name, value, onChange, options, error, span, getLabel }) {
  const listId = `${name}_list`
  return (
    <div className={span ? `col-span-${span}` : undefined}>
      <LabelRow required={required}>{label}</LabelRow>
      <div className="rounded-lg relative mt-1.5">
        <input
          className={INPUT}
          type="text"
          name={name}
          list={listId}
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
        />
        <datalist id={listId}>
          {(options || []).map((o) => <option key={o.id} value={getLabel(o)} />)}
        </datalist>
      </div>
      <FieldError msg={error} />
    </div>
  )
}

/** Radio group. The app hides the native input and styles the adjacent label,
 *  rendering the option text in a <p> — matched here so the control reads the
 *  same way in the DOM. */
export function RadioGroup({ name, value, options, onChange }) {
  return (
    <div className="flex gap-4 items-center min-h-10">
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-2 cursor-pointer" htmlFor={`${name}_${o.value}`}>
          <input
            type="radio"
            id={`${name}_${o.value}`}
            name={name}
            className="hidden"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span
            className={`inline-flex items-center justify-center rounded-full border 2xl:size-4 size-3.5 ${
              value === o.value ? 'border-indigo-600' : 'border-gray-300'
            }`}
          >
            {value === o.value && <span className="rounded-full bg-indigo-600 2xl:size-2 size-1.5" />}
          </span>
          <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium">{o.label.trim()}</p>
        </label>
      ))}
    </div>
  )
}

/** Inline checkbox — the app puts this same class on EVERY checkbox in the
 *  form; the tick is painted by .tick-checkbox:checked:after using
 *  /collabcrm/assets/right-icon-e1052359.svg. */
export function InlineCheck({ name, id, checked, onChange, children }) {
  return (
    <label className="text-gray-900 py-0.5 cursor-pointer 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal flex items-center gap-2 whitespace-nowrap">
      <input type="checkbox" className={CHECKBOX_CLS} name={name} id={id} checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  )
}

/** Sub-heading inside a card (Present Address, Children, Previous Organizations). */
export function SubHeading({ children, mb }) {
  return (
    <p className={`2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700 font-medium${mb ? ' mb-4' : ''}`}>{children}</p>
  )
}

/** The "+ Add" button repeatable sections use. */
export function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 px-3.5 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-1.5 py-1 2xl:h-9 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:px-3.5 pl-2"
    >
      <div className="flex items-center justify-center gap-2">
        <span className="icon-plus 2xl:text-xl 2xl-to-xl:text-lg text-lg" />Add
      </div>
    </button>
  )
}
