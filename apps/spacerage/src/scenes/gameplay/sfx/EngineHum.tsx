import { useAudioComposer } from "audio-composer"
import { useLayoutEffect } from "react"

export const EngineHum = () => {
  const { listener } = useAudioComposer()

  useLayoutEffect(() => {
    if (!listener) return

    const audioCtx = listener.context
    const time = audioCtx.currentTime

    const oscillator = audioCtx.createOscillator()
    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(110, time)
    // oscillator.connect(audioCtx.destination)
    const sweepEnv = audioCtx.createGain()
    const min = 0.1
    const max = 0.5

    sweepEnv.gain.cancelScheduledValues(time)
    sweepEnv.gain.setValueAtTime(min, time)
    const rate = 0.2
    for (let i = 0; i < 100000; i++) {
      sweepEnv.gain.linearRampToValueAtTime(max, time + i * rate)
      sweepEnv.gain.linearRampToValueAtTime(min, time + i * rate + rate / 2)
    }

    oscillator.connect(sweepEnv).connect(audioCtx.destination)
    oscillator.start()

    return () => {
      oscillator.stop()
    }
  }, [listener])

  return null
}
