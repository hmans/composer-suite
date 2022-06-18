import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "three-vfx"

const Firefly = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mesh.current.position.set(
      Math.sin(t * 5) * Math.cos(t) * 5,
      10 + Math.cos(t * 3) * Math.sin(t) * 8,
      Math.sin(t * 1) * Math.cos(t * 0.5) * 3
    )
  })

  return (
    <mesh ref={mesh}>
      <dodecahedronGeometry args={[0.5]} />
      <meshStandardMaterial color="white" />

      <Repeat interval={1}>
        <Emitter count={1} />
      </Repeat>
    </mesh>
  )
}

export const FireflyExample = () => {
  return (
    <VisualEffect>
      <MeshParticles>
        <planeGeometry />
        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
        />

        <Firefly />
      </MeshParticles>
    </VisualEffect>
  )
}
