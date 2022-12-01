export const frame = {
  time: performance.now() / 1000,
  count: 0
}

function tick() {
  requestAnimationFrame(tick)

  frame.time = performance.now() / 1000
  frame.count++
}

requestAnimationFrame(tick)
