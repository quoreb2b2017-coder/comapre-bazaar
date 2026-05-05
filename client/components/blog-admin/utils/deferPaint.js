/**
 * Run callback after the browser has had a chance to paint (two frames).
 */
export function afterNextPaint(callback) {
  if (typeof window === 'undefined') {
    callback()
    return
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback()
    })
  })
}
