/* Avatar with a "#OpenToWork"-style arc band.
 *
 * A thick coloured band wraps the BOTTOM of the circular photo and the label is
 * curved ALONG that arc via SVG <textPath> — not a border with a chip under it.
 * The photo stays fully visible; the band reads before the name because it is
 * part of the largest element on the panel.
 *
 * Geometry (viewBox 160x160, centre 80,80):
 *   band centreline radius 69, stroke-width 22  -> outer edge lands at r=80,
 *   flush with the avatar edge. There is NO full ring: LinkedIn's frame is the
 *   band alone, and a ring plus a band reads as two competing outlines.
 *   arc spans 145° -> 35° through the bottom (90° in SVG's y-down system).
 *
 * Colour is warning-400 = rgb(253 176 34), a real token from the app's CSS.
 */
const R = 69
const C = 80
const pt = (deg) => {
  const a = (deg * Math.PI) / 180
  return [C + R * Math.cos(a), C + R * Math.sin(a)]
}
const [x1, y1] = pt(145)
const [x2, y2] = pt(35)
const ARC = `M ${x1.toFixed(1)},${y1.toFixed(1)} A ${R},${R} 0 0 0 ${x2.toFixed(1)},${y2.toFixed(1)}`

export default function RestrictedAvatar({ initials, restricted, label = 'RESTRICTED' }) {
  return (
    <div className="relative 2xl:size-[160px] 2xl-to-xl:size-[120px] size-[120px]">
      <div
        className="rounded-full size-full bg-primary-500 flex items-center justify-center border-4 border-white" 
      >
        <span className="font-medium text-white uppercase text-3xl">{initials}</span>
      </div>

      {restricted && (
        <svg
          viewBox="0 0 160 160"
          className="absolute inset-0 size-full pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* the band's centreline — the text rides this same path */}
            <path id="restricted-arc" d={ARC} fill="none" />
          </defs>
          {/* the band itself */}
          <use
            href="#restricted-arc"
            stroke="rgb(253 176 34)"
            strokeWidth="22"
            strokeLinecap="butt"
            fill="none"
          />
          {/* the label, curved along the arc */}
          <text
            fill="#ffffff"
            fontSize="14"
            fontWeight="700"
            letterSpacing="1.4"
            dominantBaseline="middle"
          >
            <textPath href="#restricted-arc" startOffset="50%" textAnchor="middle">
              {label}
            </textPath>
          </text>
        </svg>
      )}
    </div>
  )
}
