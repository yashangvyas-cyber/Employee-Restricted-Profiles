/* Small pieces lifted verbatim out of the crawled listing markup.
   Source: modules/people/dom/employee_listing.html (2026-09-21) */

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('')

/* The ten avatar background classes the app uses, read off the crawled rows.
   The CLASSES are copied; the rule that picks one per person is ours - the
   app's own assignment rule was not captured. */
const AVATAR_BG = [
  'bg-primary-500', 'bg-blue-500', 'bg-pink-500', 'bg-violet-500', 'bg-success-500',
  'bg-warning-500', 'bg-error-500', 'bg-indigo-500', 'bg-gray-500',
  // 'bg-orange' also appears on rows in the crawled DOM but has NO rule in the
  // app's compiled CSS, so it renders transparent there too. Left out on purpose.
]
const avatarBg = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_BG[h % AVATAR_BG.length]
}

/** Round avatar + initials, as rendered in the Name cell. */
export function Avatar({ name, size = 'row' }) {
  const bg = avatarBg(name)
  const box =
    size === 'row'
      ? `rounded-full flex items-center justify-center ${bg} 2xl:h-[35px] 2xl-to-xl:h-8 h-8 2xl:w-[35px] 2xl-to-xl:w-8 w-8`
      : `rounded-full flex items-center justify-center ${bg} 2xl:h-6 2xl-to-xl:h-5 h-5 2xl:w-6 2xl-to-xl:w-5 w-5`
  const wrap =
    size === 'row'
      ? 'rounded-full overflow-hidden 2xl:h-[35px] 2xl-to-xl:h-8 h-8 2xl:w-[35px] 2xl-to-xl:w-8 w-8'
      : 'rounded-full overflow-hidden 2xl:h-6 2xl-to-xl:h-5 h-5 2xl:w-6 2xl-to-xl:w-5 w-5'
  const txt =
    size === 'row'
      ? 'font-medium text-white uppercase 2xl:text-sm 2xl-to-xl:text-xs text-xs'
      : 'text-xs font-medium leading-none uppercase 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs text-white'
  return (
    <div className={wrap}>
      <div className={box}>
        <span className={txt}>{initials(name)}</span>
      </div>
    </div>
  )
}

/** Soft-indigo pill - used for Department and for the "1 - 10 of N" count. */
export function Pill({ children }) {
  return (
    <div className="rounded-2xl border flex w-max font-medium items-center border-indigo-200 bg-indigo-50 text-indigo-700 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs 2xl:!py-0.5 2xl-to-xl:!py-0 !py-0 py-0.5 px-2 text-xs">
      <span>{children}</span>
    </div>
  )
}

/* Dot colour per status. `bg-success-500` was read off a confirmed row; the
   other four come from the app's own status palette in the compiled CSS. */
const STATUS_DOT = {
  confirmed: 'bg-success-500',
  probation: 'bg-blue-500',
  intern: 'bg-pink-500',
  notice_period: 'bg-warning-500',
  relieved: 'bg-error-500',
}

/** Bordered pill with a coloured dot - the Status cell. */
export function StatusPill({ status }) {
  const dot = STATUS_DOT[status] || 'bg-gray-400'
  return (
    <div className="rounded-md border flex font-medium items-center w-max py-0.5 px-2 text-xs text-black !border-[#d2d4d9]">
      <div className={`h-1.5 w-1.5 rounded-full mr-2 ${dot}`} />
      <span><span className="capitalize">{String(status || '').replace(/_/g, ' ')}</span></span>
    </div>
  )
}

/** Mini avatar + shortened name - the "Reporting to" cell. */
export function PersonChip({ name }) {
  if (!name) return <span className="text-gray-400">-</span>
  const [f, ...r] = name.split(' ')
  const short = r.length ? `${f} ${r[r.length - 1][0]}.` : f
  return (
    <span className="truncate inline-grid grid-cols-[24px_auto] items-center gap-x-1.5 rounded-md border border-lightGray px-2 py-1 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs font-medium text-gray-600  max-w-28 w-full">
      <Avatar name={name} size="chip" />
      <span className="capitalize truncate" title={name}>{short}</span>
    </span>
  )
}

/* Hidden profile marker.
   The badge class is the app's captured pill pattern; the icon (icon-lock-01)
   exists in the icon font. The ROW TINT is a NEW pattern for CollabCRM - the app
   differentiates rows only via the status pill today. bg-warning-25 is a real
   token: rgb(255 252 245). [PROPOSED] */
export const ROW_TINT = 'bg-warning-25'

/* Two variants.
   `compact` (icon only) is used in the Name cell: the column is min-w-[250px]
   from the capture and a text badge needs ~85px, which truncated either the
   name or the designation. The row tint carries the "different" signal, the
   lock confirms it, the tooltip supplies the word.
   The full badge is used where there is room — the View header, Payroll. */
export function HiddenBadge({ compact = false }) {
  const title = 'Hidden profile — an Internal & Payroll profile, not counted in headcount and not visible across other portals'
  if (compact) {
    return (
      <span
        className="icon-lock-01 text-warning-700 shrink-0 2xl:text-base text-sm"
        title={title}
        aria-label="Hidden profile"
      />
    )
  }
  return (
    <div
      className="rounded-md border flex w-max font-medium items-center bg-warning-50 border-warning-300 text-warning-700 py-0.5 px-2 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs"
      title={title}
    >
      <span className="icon-lock-01 me-1" />
      <span>Hidden</span>
    </div>
  )
}

/** Primary button - exact class string from the "Add Employee" button. */
export const BTN_PRIMARY =
  'outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white 2xl:py-[7px] 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs'

/** Secondary button - from the header "New" button. */
export const BTN_SECONDARY =
  'outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:px-4 2xl-to-xl:px-3 px-3 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs'

export const TH =
  '2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:px-6 2xl-to-xl:px-4 px-4 whitespace-nowrap 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium text-gray-600 text-left bg-gray-50 top-0'
export const TD =
  'whitespace-nowrap 2xl:px-6 2xl-to-xl:px-4 px-4 2xl:py-2.5 2xl-to-xl:py-1.5 py-1.5 2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-600 text-left'

/** Form field label - the app renders these with the bare class "label". */
export function Label({ children, required }) {
  return (
    <label className="label">
      {children}&nbsp;{required && <span className="text-error-500">*</span>}
    </label>
  )
}

export const INPUT =
  'rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white mt-0 w-full 2xl:h-10 2xl-to-xl:h-9 h-9 2xl:text-sm 2xl-to-xl:text-xs text-xs placeholder:!text-gray-450'
export const TEXTAREA =
  'w-full min-h-[42px] 2xl:!text-sm 2xl-to-xl:!text-xs !text-xs rounded-lg py-2 outline-none placeholder-gray-500 px-3 border border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple bg-white min-w-full resize-none h-[90px] text-sm'
