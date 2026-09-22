/* Avatar with a LinkedIn "#OpenToWork"-style frame.
 *
 * Structure, which is the part I got wrong twice:
 *   the photo SHRINKS and a COMPLETE ring is drawn AROUND it. The ring is a
 *   full 360° circle of uniform width sitting entirely OUTSIDE the photo edge —
 *   it never overlaps the photo — and the label is curved along the BOTTOM arc
 *   of that same ring.
 *
 * Geometry (viewBox 160x160, centre 80,80):
 *   ring centreline r = 69, stroke-width 22  ->  inner edge 58, outer edge 80
 *   photo radius   = 58                      ->  photo ends exactly where the
 *                                                ring begins
 *   label rides a bottom arc on r = 69, the ring's own centreline
 *
 * Colour: warning-400 = rgb(253 176 34), a real token from the app's stylesheet.
 */
const BOX = 160
const C = BOX / 2
const RING_R = 69          // ring centreline
const RING_W = 22          // ring thickness
const PHOTO_INSET_PCT = ((RING_W / BOX) * 100).toFixed(2) + '%'   // photo sits inside the ring

const pt = (deg) => {
  const a = (deg * Math.PI) / 180
  return [C + RING_R * Math.cos(a), C + RING_R * Math.sin(a)]
}
// bottom arc, left -> right through 90° (bottom in SVG's y-down system)
const [ax, ay] = pt(160)
const [bx, by] = pt(20)
const LABEL_ARC = `M ${ax.toFixed(1)},${ay.toFixed(1)} A ${RING_R},${RING_R} 0 0 0 ${bx.toFixed(1)},${by.toFixed(1)}`

export default function HiddenAvatar({ initials, hidden, label = 'HIDDEN PROFILE' }) {
  if (!hidden) {
    return (
      <div className="rounded-full 2xl:size-[160px] 2xl-to-xl:size-[120px] size-[120px] border-4 border-white bg-primary-500 flex items-center justify-center">
        <span className="font-medium text-white uppercase text-3xl">{initials}</span>
      </div>
    )
  }
  return (
    <div className="relative 2xl:size-[160px] 2xl-to-xl:size-[120px] size-[120px]">
      {/* the photo, shrunk so the ring can sit around it */}
      <div
        className="absolute rounded-full bg-primary-500 flex items-center justify-center"
        style={{ inset: PHOTO_INSET_PCT }}
      >
        <span className="font-medium text-white uppercase 2xl:text-3xl text-2xl">{initials}</span>
      </div>

      <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 size-full pointer-events-none">
        <defs>
          <path id="hidden-arc" d={LABEL_ARC} fill="none" />
        </defs>
        {/* the COMPLETE ring, around the photo */}
        <circle
          cx={C}
          cy={C}
          r={RING_R}
          fill="none"
          stroke="rgb(253 176 34)"
          strokeWidth={RING_W}
        />
        {/* label curved along the bottom of that ring */}
        <text fill="#ffffff" fontSize="13" fontWeight="700" letterSpacing="1.3" dominantBaseline="middle">
          <textPath href="#hidden-arc" startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
      </svg>
    </div>
  )
}
