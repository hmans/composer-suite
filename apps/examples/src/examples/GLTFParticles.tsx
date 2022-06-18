import { useGLTF } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { Euler, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "three-vfx"

export const GLTFParticles = () => {
  const gltf = useGLTF("/models/spaceship26.gltf") as any

  const { geometry, material } = gltf.nodes["Hull"]

  return (
    <VisualEffect>
      <MeshParticles geometry={geometry} maxParticles={500}>
        <ParticlesMaterial baseMaterial={material} depthTest depthWrite />

        <Repeat interval={1}>
          <Emitter
            count={8}
            setup={(c) => {
              c.quaternion.setFromEuler(
                new Euler(
                  plusMinus(-Math.PI / 20),
                  -Math.PI / 2,
                  plusMinus(-Math.PI / 20)
                )
              )
              c.position.set(-60, between(2, 18), plusMinus(16))

              c.velocity
                .set(0, 0, -between(10, 70))
                .applyQuaternion(c.quaternion)

              c.delay = upTo(1)
              c.lifetime = 20

              c.alpha = [1, 1]

              c.scale[0].setScalar(0.3)
              c.scale[1].setScalar(0.3)
            }}
          />
        </Repeat>
      </MeshParticles>
    </VisualEffect>
  )
}
