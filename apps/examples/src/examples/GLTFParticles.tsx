import { useGLTF } from "@react-three/drei"
import { between } from "randomish"
import { Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "vfx"

const offset = new Vector3(0, 10, 0)

export const GLTFParticles = () => {
  const gltf = useGLTF("/models/spaceship26.gltf")

  const { geometry, material } = gltf.nodes["Hull"]

  return (
    gltf && (
      <VisualEffect>
        <MeshParticles geometry={geometry} maxParticles={500}>
          <ParticlesMaterial baseMaterial={material} depthTest depthWrite />

          <Repeat interval={1 / 8}>
            <Emitter
              count={1}
              setup={(c) => {
                c.quaternion.random()

                c.position.copy(offset)

                c.velocity
                  .set(0, 0, -1)
                  .applyQuaternion(c.quaternion)
                  .multiplyScalar(between(5, 10))

                c.lifetime = 10

                c.alphaStart = 1
                c.alphaEnd = 1

                c.scaleStart.setScalar(0.3)
                c.scaleEnd.setScalar(0.3)
              }}
            />
          </Repeat>
        </MeshParticles>
      </VisualEffect>
    )
  )
}
