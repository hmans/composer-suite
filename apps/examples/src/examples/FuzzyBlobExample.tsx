import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { useRef } from "react"
import { InstancedMesh, MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"

export const FuzzyBlob = ({ count = 20000, rotationSpeed = 0.4 }) => {
  const mesh = useRef<any>() // TODO: eh
  const t = useRef(0)

  useFrame((_, dt) => {
    mesh.current.rotation.x = mesh.current.rotation.y += rotationSpeed * dt
    t.current += dt
    mesh.current.scale.setScalar(1 + Math.sin(t.current * 0.5) * 0.1)
  })

  const texture = useTexture("/textures/particle.png")

  return (
    <MeshParticles
      position-y={13}
      maxParticles={count * 10}
      safetySize={3000}
      ref={mesh}
    >
      <boxGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        map={texture}
        color="#aaa"
        depthTest={true}
        depthWrite={true}
        scaleFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
      />

      <Repeat times={Infinity} interval={0.2}>
        <Emitter
          count={2000}
          setup={(c) => {
            c.quaternion.random()
            c.position.set(0, 1, 0).applyQuaternion(c.quaternion)

            c.lifetime = 1.5
            c.scale[0].set(0.1, 0.1, 0.1)

            c.scale[1].set(0.1, 0.1, 10 + upTo(15))
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}

export const FuzzyBlobExample = () => (
  <>
    <FuzzyBlob />
  </>
)
