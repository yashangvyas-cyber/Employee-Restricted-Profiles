/* Incognito mark — hat + glasses, the Chrome idiom for "hidden".
 *
 * INVENTED, not copied: CollabCRM's icon font has 380 glyphs and none of them
 * is an incognito mark. The nearest were icon-eye-off / icon-user-x-01, which
 * read as "disabled" rather than "hidden". Drawn inline so it can inherit
 * currentColor and animate on hover.
 *
 * The glasses shift slightly on group-hover — the same technique as the
 * animated icons discussed: a CSS transform on a child of an inline SVG, with a
 * transition so it eases back on mouse-out. No library.
 */
export default function IncognitoIcon({ className = '', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`incognito shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={title || 'Hidden profile'}
      role="img"
    >
      {title && <title>{title}</title>}
      {/* hat */}
      <path className="incognito-hat" d="M6.5 10.5 8 5.6a1.6 1.6 0 0 1 2-1.1l2 .6 2-.6a1.6 1.6 0 0 1 2 1.1l1.5 4.9" />
      <path d="M3.5 10.8h17" />
      {/* glasses */}
      <g className="incognito-glasses">
        <circle cx="7.6" cy="16.2" r="3.1" />
        <circle cx="16.4" cy="16.2" r="3.1" />
        <path d="M10.7 15.6c.8-.5 1.8-.5 2.6 0" />
      </g>
    </svg>
  )
}
