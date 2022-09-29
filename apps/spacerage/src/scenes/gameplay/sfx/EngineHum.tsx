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
