import { useFrame } from "@react-three/fiber"
import { upTo } from "randomish"
import { useRef } from "react"
import { Color, Mesh, MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  VisualEffect
} from "three-vfx"

export const FireflyExample = () => {
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
    <VisualEffect>
      <MeshParticles>
        <planeGeometry args={[0.2, 0.2]} />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color={new Color(2, 1, 2)}
          blending={NormalBlending}
          billboard
          depthTest={true}
          depthWrite={false}
          transparent
        />

        <mesh ref={mesh}>
          <dodecahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>

        <Emitter
          continuous
          count={10}
          setup={(c) => {
            c.position.randomDirection().add(mesh.current.position)
            c.delay = upTo(0.1)
            c.velocity.randomDirection().multiplyScalar(upTo(5))
            c.acceleration.set(0, -12, 0)
            c.alpha = [1, 0]
          }}
        />
      </MeshParticles>
    </VisualEffect>
  )
}
