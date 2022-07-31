import { useGLTF } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { Euler } from "three"
import { Emitter, MeshParticles, MeshParticlesMaterial } from "three-vfx"
import { Repeat } from "timeline-composer"

export const GLTFParticles = () => {
  const gltf = useGLTF("/models/spaceship26.gltf") as any

  const { geometry, material } = gltf.nodes["Hull"]

  return (
    <MeshParticles geometry={geometry} maxParticles={500}>
      <MeshParticlesMaterial baseMaterial={material} depthTest depthWrite />

      <Repeat seconds={1}>
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

            c.velocity.set(0, 0, -between(10, 70)).applyQuaternion(c.quaternion)

            c.lifetime.delay = upTo(1)
            c.lifetime.duration = 20

            c.scale.min.setScalar(0.3)
            c.scale.max.setScalar(0.3)
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}
