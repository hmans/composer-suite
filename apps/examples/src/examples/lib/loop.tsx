export const loop = (callback: () => void) => {
  let running = true

  const tick = () => {
    if (running) {
      requestAnimationFrame(tick)
      callback()
    }
  }

  tick()

  return () => {
    running = false
  }
}
