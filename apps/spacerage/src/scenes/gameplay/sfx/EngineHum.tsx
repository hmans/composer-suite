import { useAudioComposer } from "audio-composer"
import { useLayoutEffect } from "react"

export type OscillatorProps = {
  children?: JSX.Element
  frequency?: number
  type?: OscillatorType
}

export const Oscillator = ({
  type = "sine",
  frequency = 440,
  children
}: OscillatorProps) => {
  const { listener } = useAudioComposer()

  useLayoutEffect(() => {
    if (!listener) return
    const audioCtx = listener.context
    const time = audioCtx.currentTime

    const oscillator = audioCtx.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, time)

    oscillator.connect(audioCtx.destination)
    oscillator.start(time)

    return () => {
      oscillator.stop()
    }
  }, [listener])

  return children as JSX.Element
}

export const EngineHum = () => {
  const { listener } = useAudioComposer()

  // useLayoutEffect(() => {
  //   if (!listener) return

  //   const audioCtx = listener.context
  //   const time = audioCtx.currentTime

  //   const oscillator = audioCtx.createOscillator()
  //   oscillator.type = "sawtooth"
  //   oscillator.frequency.setValueAtTime(110, time)
  //   // oscillator.connect(audioCtx.destination)
  //   const sweepEnv = audioCtx.createGain()
  //   const min = 0.1
  //   const max = 0.5

  //   sweepEnv.gain.cancelScheduledValues(time)
  //   sweepEnv.gain.setValueAtTime(min, time)
  //   const rate = 0.2
  //   for (let i = 0; i < 100000; i++) {
  //     sweepEnv.gain.linearRampToValueAtTime(max, time + i * rate)
  //     sweepEnv.gain.linearRampToValueAtTime(min, time + i * rate + rate / 2)
  //   }

  //   oscillator.connect(sweepEnv).connect(audioCtx.destination)
  //   oscillator.start()

  //   return () => {
  //     oscillator.stop()
  //   }
  // }, [listener])

  return (
    <>
      <Oscillator type="sine" frequency={44} />
      <Oscillator type="sine" frequency={88} />
      <Oscillator type="sine" frequency={40} />
    </>
  )
}
