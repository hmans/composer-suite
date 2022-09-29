import { useFrame } from "@react-three/fiber"
import { useAudioComposer } from "audio-composer"
import {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { useStore } from "statery"
import { AudioContext } from "three"
import { ECS, gameplayStore } from "../state"

const nodeContext = createContext<AudioNode>(null!)

export type OscillatorProps = {
  children?: ReactNode
  frequency?: number
  type?: OscillatorType
}

export const Oscillator = forwardRef<OscillatorNode, OscillatorProps>(
  ({ type = "sine", frequency = 440, children }, ref) => {
    const audioCtx = AudioContext.getContext()

    const parent = useContext(nodeContext)

    const oscillator = useMemo(() => {
      const time = audioCtx.currentTime

      const oscillator = audioCtx.createOscillator()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, time)
      oscillator.connect(parent || audioCtx.destination)

      return oscillator
    }, [audioCtx])

    useLayoutEffect(() => {
      oscillator.start()

      return () => {
        oscillator.stop()
      }
    }, [])

    useImperativeHandle(ref, () => oscillator)

    return <>{children}</>
  }
)

export type GainNodeProps = {
  children?: ReactNode
}

export const Gain = forwardRef<GainNode, GainNodeProps>(({ children }, ref) => {
  const audioCtx = AudioContext.getContext()

  const gainNode = useMemo(() => {
    const gainNode = audioCtx.createGain()
    gainNode.connect(audioCtx.destination)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)

    return gainNode
  }, [audioCtx])

  return (
    <nodeContext.Provider value={gainNode}>{children}</nodeContext.Provider>
  )
})

export const EngineHum = () => {
  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const osc3 = useRef<OscillatorNode>(null!)

  const baseFrequency = 22

  const [player] = ECS.useArchetype("player", "rigidBody")

  useFrame(() => {
    if (!player) return

    osc1.current.frequency.value =
      baseFrequency + player.rigidBody.linvel().length() * 1

    osc2.current.frequency.value =
      baseFrequency * 2 + player.rigidBody.linvel().length() * 1.3

    osc3.current.frequency.value =
      baseFrequency * 1.1 + player.rigidBody.linvel().length() * 2
  })

  return (
    <Gain>
      <Oscillator type="triangle" frequency={baseFrequency} ref={osc1} />
      <Oscillator type="triangle" frequency={88} ref={osc2} />
      <Oscillator type="triangle" frequency={40} ref={osc3} />
    </Gain>
  )
}
