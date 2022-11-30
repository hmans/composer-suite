export let frameTime = 0

function tick(time: number) {
  frameTime = time / 1000
  requestAnimationFrame(tick)
}

requestAnimationFrame(tick)
