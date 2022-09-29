import { useFrame } from "@react-three/fiber"
import { useAudioComposer } from "audio-composer"
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { useStore } from "statery"
import { AudioContext } from "three"
import { ECS, gameplayStore } from "../state"

export type OscillatorProps = {
  children?: JSX.Element
  frequency?: number
  type?: OscillatorType
}

export const Oscillator = forwardRef<OscillatorNode, OscillatorProps>(
  ({ type = "sine", frequency = 440, children }, ref) => {
    const audioCtx = AudioContext.getContext()

    const oscillator = useMemo(() => {
      const time = audioCtx.currentTime

      const oscillator = audioCtx.createOscillator()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, time)
      oscillator.connect(audioCtx.destination)

      return oscillator
    }, [audioCtx])

    useLayoutEffect(() => {
      oscillator.start()

      return () => {
        oscillator.stop()
      }
    }, [])

    useImperativeHandle(ref, () => oscillator)

    return children as JSX.Element
  }
)

export const EngineHum = () => {
  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const osc3 = useRef<OscillatorNode>(null!)

  const baseFrequency = 44

  const [player] = ECS.useArchetype("player", "rigidBody")

  useFrame(() => {
    if (!player || !osc1.current) return

    osc1.current.frequency.value =
      baseFrequency + player.rigidBody.linvel().length() * 2

    osc2.current.frequency.value =
      baseFrequency * 2 + player.rigidBody.linvel().length() * 3

    osc3.current.frequency.value =
      baseFrequency * 1.1 + player.rigidBody.linvel().length() * 4
  })

  return (
    <>
      <Oscillator type="triangle" frequency={baseFrequency} ref={osc1} />
      <Oscillator type="triangle" frequency={88} ref={osc2} />
      <Oscillator type="triangle" frequency={40} ref={osc3} />
    </>
  )
}
