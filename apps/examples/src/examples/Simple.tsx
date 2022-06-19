import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { MeshStandardMaterial, NormalBlending } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "three-vfx"

export const Simple = () => {
  const texture = useTexture("/textures/particle.png")

  return (
    <VisualEffect>
      <MeshParticles>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          blending={NormalBlending}
          map={texture}
          color="white"
          transparent
          billboard
          depthTest={false}
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
    </VisualEffect>
  )
}
