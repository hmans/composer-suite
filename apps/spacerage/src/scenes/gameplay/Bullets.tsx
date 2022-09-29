import { Gain, Oscillator } from "audio-composer"
import { between, random } from "randomish"
import { useLayoutEffect, useRef } from "react"
import { Color, Quaternion, Vector3 } from "three"
import { OrbitControlsExp } from "three-stdlib"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { ECS } from "./state"

export const Bullets = () => (
  <InstancedParticles capacity={200}>
    <planeGeometry args={[0.1, 0.8]} />
    <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />

    <ECS.ArchetypeEntities archetype={["bullet"]}>
      {({ bullet }) => bullet}
    </ECS.ArchetypeEntities>
  </InstancedParticles>
)

export const spawnBullet = (
  position: Vector3,
  quaternion: Quaternion,
  velocity: Vector3
) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 1,
    velocity,

    bullet: (
      <>
        <ECS.Component name="sceneObject">
          <Particle
            position={position}
            quaternion={quaternion}
            matrixAutoUpdate
          />
        </ECS.Component>

        <PewPewSFX />
      </>
    )
  })

const PewPewSFX = () => {
  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const gain2 = useRef<GainNode>(null!)

  useLayoutEffect(() => {
    const t = osc1.current.context.currentTime

    osc1.current.frequency.linearRampToValueAtTime(20, t + 0.3)

    osc2.current.frequency.linearRampToValueAtTime(2000, t + 0.2)
    gain2.current.gain.linearRampToValueAtTime(0, t + 0.2)
  }, [])

  return (
    <Gain volume={0.1}>
      <Oscillator
        type="sine"
        frequency={between(1500, 1900)}
        duration={0.3}
        ref={osc1}
      />
      <Gain volume={0.4} ref={gain2}>
        <Oscillator
          type="sawtooth"
          frequency={between(500, 1500)}
          duration={0.2}
          ref={osc2}
        />
      </Gain>
    </Gain>
  )
}
