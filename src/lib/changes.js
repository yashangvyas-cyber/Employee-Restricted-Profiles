/* "Show changes" mode.
 *
 * The prototype is deliberately a pixel copy of CollabCRM, which makes it
 * impossible to tell our change from the existing product — the exact problem
 * reviewers hit. This flips a mode that outlines every changed element and
 * labels what kind of change it is.
 *
 * Off by default, so the prototype still reads as the real app.
 * Tag an element with  data-change="NEW" | "CHANGED" | "MOVED" | "REMOVED".
 */
const KEY = 'collabcrm-show-changes'

export const getShowChanges = () => {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

export function setShowChanges(on) {
  try { sessionStorage.setItem(KEY, on ? '1' : '0') } catch { /* private mode */ }
  document.body.classList.toggle('show-changes', on)
}

/** Apply the persisted state on boot. */
export function initShowChanges() {
  document.body.classList.toggle('show-changes', getShowChanges())
}
