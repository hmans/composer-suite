import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { MeshStandardMaterial, TextureLoader } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect
} from "three-vfx"

const globalTexture = new TextureLoader().load("/textures/particle.png")

export const Composable = () => {
  return (
    <VisualEffect>
      <MeshParticles>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          billboard
          color="orange"
          map={globalTexture}
          transparent
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
    </VisualEffect>
  )
}
