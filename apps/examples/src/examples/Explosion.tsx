import { CameraShake } from "@react-three/drei"
import { between, plusMinus, power, upTo } from "randomish"
import { Color, MeshStandardMaterial, TextureLoader, Vector3 } from "three"
import {
  Delay,
  Emitter,
  Lifetime,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  VisualEffect,
  VisualEffectProps
} from "vfx"

const gravity = new Vector3(0, -20, 0)
const direction = new Vector3()

const texture = new TextureLoader().load("/textures/smoke.png")

const SmokeRing = () => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial baseMaterial={MeshStandardMaterial} color="white" />

    <Repeat times={3} interval={0.5}>
      <Emitter
        count={between(25, 40)}
        setup={(c) => {
          direction
            .set(1, 0, 0)
            .applyAxisAngle(new Vector3(0, 1, 0), between(0, Math.PI * 2))

          c.position.copy(direction).multiplyScalar(3 + plusMinus(0.2))

          c.velocity.copy(direction).multiplyScalar(10 + plusMinus(3))

          c.acceleration.copy(direction).multiplyScalar(-3)

          c.scaleStart.setScalar(1 + plusMinus(0.3))
          c.scaleEnd.setScalar(0)

          c.lifetime = between(0.5, 1.5)

          c.colorStart.setScalar(1)
          c.colorEnd.setScalar(0)
        }}
      />
    </Repeat>
  </MeshParticles>
)

const Rocks = () => (
  <MeshParticles>
    <dodecahedronGeometry />
    <ParticlesMaterial baseMaterial={MeshStandardMaterial} color="#fff" />

    <Emitter
      count={between(50, 100)}
      setup={(c) => {
        direction
          .set(1, 0, 0)
          .applyAxisAngle(new Vector3(0, 0, 1), between(0, Math.PI / 4))
          .applyAxisAngle(new Vector3(0, 1, 0), between(0, Math.PI * 2))

        c.position.copy(direction).multiplyScalar(3 + plusMinus(0.2))
        c.quaternion.random()

        c.velocity.copy(direction).multiplyScalar(12 + power(3) * 12)

        c.acceleration.copy(gravity)

        c.scaleStart.setScalar(0.2 + power(3) * 1)
        c.scaleEnd.copy(c.scaleStart)

        c.lifetime = between(0.5, 1.5)

        c.colorStart.lerpColors(new Color("#444"), new Color("#000"), power(3))
        c.colorEnd.copy(c.colorStart)
      }}
    />
  </MeshParticles>
)

const Fireball = () => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial baseMaterial={MeshStandardMaterial} color="#fff" />

    <Emitter
      count={() => 5 + power(3) * 10}
      setup={(c) => {
        direction.randomDirection()
        c.position.copy(direction).multiplyScalar(between(0, 2))
        c.velocity.copy(direction).multiplyScalar(between(2, 4))

        c.scaleStart.setScalar(between(0.5, 1))
        c.scaleEnd.setScalar(between(3, 6))

        c.delay = upTo(0.3)
        c.lifetime = between(0.8, 1.4)

        c.colorStart.lerpColors(
          new Color("red").multiplyScalar(10),
          new Color("yellow").multiplyScalar(10),
          power(3)
        )
        c.colorEnd.copy(c.colorStart)
      }}
    />
  </MeshParticles>
)

const SmokeCloud = () => (
  <MeshParticles>
    <planeGeometry />

    <ParticlesMaterial
      baseMaterial={MeshStandardMaterial}
      map={texture}
      depthWrite={false}
      billboard
    />

    <Emitter
      count={() => between(60, 80)}
      setup={(c) => {
        direction.randomDirection()

        c.position.copy(direction).multiplyScalar(between(2, 4))

        c.velocity
          .copy(direction)
          .multiplyScalar(between(2, 5))
          .add(new Vector3(0, between(2, 3), 0))

        c.acceleration
          .randomDirection()
          .multiplyScalar(between(0, 3))
          .add(direction.clone().multiplyScalar(-between(2, 5)))

        c.scaleStart.setScalar(between(0.5, 1.5))
        c.scaleEnd.setScalar(between(6, 20))

        c.delay = upTo(0.3)
        c.lifetime = between(1, 3)

        c.alphaStart = 0.5
        c.alphaEnd = 0

        c.colorStart.lerpColors(new Color("#888"), new Color("#666"), power(3))
        c.colorEnd.copy(c.colorStart)
      }}
    />
  </MeshParticles>
)

export const Explosion = (props: VisualEffectProps) => (
  <VisualEffect {...props}>
    <Lifetime seconds={5}>
      <SmokeRing />

      <Fireball />

      <Delay seconds={0.3}>
        <Fireball />

        <CameraShake
          maxYaw={0.02}
          maxPitch={0.02}
          maxRoll={0.02}
          yawFrequency={5}
          pitchFrequency={10}
          rollFrequency={2}
          decayRate={1.5}
          decay
        />

        <Delay seconds={0.2}>
          <Rocks />

          <SmokeCloud />
        </Delay>
      </Delay>
    </Lifetime>
  </VisualEffect>
)
