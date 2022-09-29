import { useFrame } from "@react-three/fiber"
import { useAudioComposer } from "audio-composer"
import { useLayoutEffect, useRef } from "react"
import { useStore } from "statery"
import { ECS, gameplayStore } from "../state"

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

  const oscillator = useRef<OscillatorNode>()

  useLayoutEffect(() => {
    if (!listener) return
    const audioCtx = listener.context
    const time = audioCtx.currentTime

    const o = audioCtx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(frequency, time)

    o.connect(audioCtx.destination)
    o.start(time)

    oscillator.current = o

    return () => {
      o.stop()
      oscillator.current = undefined
    }
  }, [listener])

  return children as JSX.Element
}

export const EngineHum = () => {
  const { listener } = useAudioComposer()

  const [player] = ECS.useArchetype("player")

  return (
    <>
      <Oscillator type="sine" frequency={44} />
      <Oscillator type="sine" frequency={88} />
      <Oscillator type="sine" frequency={40} />
    </>
  )
}
