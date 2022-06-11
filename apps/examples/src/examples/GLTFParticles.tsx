import { useGLTF } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { FC } from "react"
import { MeshStandardMaterial, SphereGeometry } from "three"
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
          <ParticlesMaterial
            baseMaterial={MeshStandardMaterial}
            depthTest={true}
            depthWrite={false}
          />

          <Repeat times={Infinity} interval={1 / 2}>
            <Emitter
              count={1}
              setup={(c) => {
                c.velocity
                  .set(plusMinus(1), upTo(1), plusMinus(1))
                  .multiplyScalar(between(1, 5))

                c.quaternion.random()

                c.lifetime = between(2.5, 5)

                c.scaleStart.setScalar(0.5)
                c.scaleEnd.setScalar(0)
              }}
            />
          </Repeat>
        </MeshParticles>
      </VisualEffect>
    )
  )
}
