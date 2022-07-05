import { Particles } from "three-vfx"

export default function ShadenfreudeParticles() {
  return (
    <group position-y={15}>
      <Particles>
        <sphereGeometry />
        <meshBasicMaterial color="white" />
      </Particles>
    </group>
  )
}
