import { useFrame } from "@react-three/fiber"
import * as AC from "audio-composer"
import { archetype } from "miniplex"
import { useRef } from "react"
import { AudioContext, MathUtils } from "three"
import { ECS } from "../state"

export const EngineHumSFX = ({ baseFrequency = 22 }) => {
  const context = AudioContext.getContext()

  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const osc3 = useRef<OscillatorNode>(null!)
  const gain = useRef<GainNode>(null!)

  const [player] = ECS.useEntities(archetype("player", "rigidBody"))

  useFrame(() => {
    if (!player) return
    const velocity = player.rigidBody.linvel().length()

    const t = context.currentTime
    osc1.current.frequency.setTargetAtTime(
      baseFrequency * 0.2 + MathUtils.smoothstep(velocity, 10, 30) * 150,
      t,
      0.1
    )
    osc2.current.frequency.setTargetAtTime(
      baseFrequency * 2 + velocity * 1.3,
      t,
      0.1
    )
    osc3.current.frequency.setTargetAtTime(
      baseFrequency * 1.1 + velocity * 3,
      t,
      0.1
    )

    gain.current.gain.setTargetAtTime(0.2 + velocity * 0.02, t, 0.1)
  })

  return (
    <AC.Gain volume={0} ref={gain}>
      <AC.Filter type="lowpass" frequency={800}>
        <AC.Oscillator type="triangle" frequency={0} ref={osc1} />
        <AC.Oscillator type="triangle" frequency={0} ref={osc2} />
        <AC.Oscillator type="triangle" frequency={0} ref={osc3} />
      </AC.Filter>
    </AC.Gain>
  )
}
