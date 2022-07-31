const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const clamp01 = (value: number) => clamp(value, 0, 1)

export const loop = (callback: (dt: number) => void) => {
  let running = true
  let lastTime = performance.now()

  const tick = () => {
    if (running) {
      requestAnimationFrame(tick)

      const now = performance.now()
      const dt = clamp01((now - lastTime) / 1000)
      lastTime = now

      callback(dt)
    }
  }

  tick()

  return () => {
    running = false
  }
}
