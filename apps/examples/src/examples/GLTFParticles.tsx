import { useGLTF } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { Euler, Vector3 } from "three"
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
    <VisualEffect>
      <MeshParticles geometry={geometry} maxParticles={500}>
        <ParticlesMaterial baseMaterial={material} depthTest depthWrite />

        <Repeat interval={1}>
          <Emitter
            count={30}
            setup={(c) => {
              c.quaternion.setFromEuler(new Euler(0, -Math.PI / 2, 0))
              c.position.set(-40, between(2, 18), plusMinus(16))

              c.velocity.set(between(10, 70), 0, 0)

              c.delay = upTo(1)
              c.lifetime = 20

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
}
