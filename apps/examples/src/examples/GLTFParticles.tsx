import { useGLTF } from "@react-three/drei"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { FC } from "react"
import { MeshStandardMaterial, SphereGeometry, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "vfx"

export const GLTFParticles = () => {
  const gltf = useGLTF("/models/spaceship26.gltf")

  const { geometry, material } = gltf.nodes["Hull"]

  return (
    gltf && (
      <VisualEffect>
        <MeshParticles geometry={geometry}>
          <ParticlesMaterial baseMaterial={material} depthTest depthWrite />

          <Emitter
            count={40}
            setup={(c) => {
              c.position.set(0, 10, 0).add(insideSphere(8) as Vector3)
              c.quaternion.random()

              c.lifetime = Infinity

              c.scaleStart.setScalar(0.3)
              c.scaleEnd.setScalar(0.3)
            }}
          />
        </MeshParticles>
      </VisualEffect>
    )
  )
}
