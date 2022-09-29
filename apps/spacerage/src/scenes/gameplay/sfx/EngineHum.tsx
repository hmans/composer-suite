import { useFrame } from "@react-three/fiber"
import { FilterNode, GainNode, OscillatorNode } from "audio-composer"
import { useRef } from "react"
import { ECS } from "../state"

export const EngineHum = ({ baseFrequency = 22 }) => {
  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const osc3 = useRef<OscillatorNode>(null!)
  const gain = useRef<GainNode>(null!)

  const [player] = ECS.useArchetype("player", "rigidBody")

  useFrame(() => {
    if (!player) return
    const velocity = player.rigidBody.linvel().length()

    osc1.current.frequency.value = baseFrequency + velocity * 1
    osc2.current.frequency.value = baseFrequency * 2 + velocity * 1.3
    osc3.current.frequency.value = baseFrequency * 1.1 + velocity * 2

    gain.current.gain.value = 0.2 + velocity * 0.02
  })

  return (
    <GainNode volume={0.4} ref={gain}>
      <FilterNode type="lowpass" frequency={200}>
        <OscillatorNode type="triangle" ref={osc1} />
        <OscillatorNode type="triangle" ref={osc2} />
        <OscillatorNode type="triangle" ref={osc3} />
      </FilterNode>
    </GainNode>
  )
}
