/**
 * An object containing information about the current frame.
 */
export const frame = {
  /**
   * The current frame time, in seconds. This value does not change
   * over the course of a single frame.
   */
  time: performance.now() / 1000,

  /**
   * The current frame count.
   */
  count: 0
}

function tick() {
  requestAnimationFrame(tick)

  frame.time = performance.now() / 1000
  frame.count++
}

requestAnimationFrame(tick)
