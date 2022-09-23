import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Group } from "three"
import { Particle, Particles } from "vfx-composer-r3f"

export default function ControlledParticlesExample() {
  const group = useRef<Group>(null!)

  useFrame(({ clock }) => {
    group.current.position.set(
      Math.cos(clock.elapsedTime * 1.3),
      Math.sin(clock.elapsedTime * 1.7),
      0
    )
  }, -100)

  return (
    <group>
      <Particles>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="hotpink" />

        <group ref={group}>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial wireframe />
          </mesh>

          <Particle />
        </group>
      </Particles>
    </group>
  )
}
