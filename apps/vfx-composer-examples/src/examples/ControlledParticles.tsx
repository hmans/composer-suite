import { Emitter, Particle, Particles } from "vfx-composer-r3f"

export default function ControlledParticlesExample() {
  return (
    <group>
      <Particles>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="hotpink" />

        <Particle />
      </Particles>
    </group>
  )
}
