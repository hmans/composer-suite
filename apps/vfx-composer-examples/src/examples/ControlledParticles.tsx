import { Emitter, Particles } from "vfx-composer-r3f"

export default function ControlledParticlesExample() {
  return (
    <group>
      <Particles>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="hotpink" />

        <Emitter limit={1} rate={Infinity} />
      </Particles>
    </group>
  )
}
