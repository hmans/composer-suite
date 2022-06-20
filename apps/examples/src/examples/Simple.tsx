import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"

export const Simple = () => {
  const texture = useTexture("/textures/particle.png")

  return (
    <MeshParticles>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        blending={NormalBlending}
        map={texture}
        color="white"
        transparent
        billboard
        depthTest={true}
        depthWrite={false}
      />

      <Repeat times={Infinity} interval={1 / 40}>
        <Emitter
          count={5}
          setup={(c) => {
            c.velocity
              .set(plusMinus(1), upTo(1), plusMinus(1))
              .multiplyScalar(between(1, 5))

            c.lifetime = between(0.5, 2.5)
          }}
        />
      </Repeat>
    </MeshParticles>
  )
}
