import { CameraShake, useTexture } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { between, plusMinus, power, upTo } from "randomish"
import { FC } from "react"
import {
  AddEquation,
  AdditiveBlending,
  Color,
  CustomBlending,
  DepthTexture,
  MeshStandardMaterial,
  NormalBlending,
  Vector3
} from "three"
import {
  Delay,
  Emitter,
  Lifetime,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"
import { useDepthBuffer } from "./lib/useDepthBuffer"

const gravity = new Vector3(0, -20, 0)
const direction = new Vector3()

const SmokeRing: FC<{ depthTexture: DepthTexture }> = ({ depthTexture }) => (
  <MeshParticles maxParticles={200}>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <MeshParticlesMaterial
      baseMaterial={MeshStandardMaterial}
      color="white"
      softness={1}
      depthTexture={depthTexture}
    />

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

          c.scale.min.setScalar(1 + plusMinus(0.3))
          c.scale.max.setScalar(0)

          c.lifetime.duration = between(0.5, 1.5)

          c.color.min.setScalar(1)
          c.color.max.setScalar(0)
          c.alpha.max = 0
        }}
      />
    </Repeat>
  </MeshParticles>
)

const Rocks = () => (
  <MeshParticles maxParticles={100}>
    <dodecahedronGeometry />
    <MeshParticlesMaterial baseMaterial={MeshStandardMaterial} color="#fff" />

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

        c.scale.min.setScalar(0.2 + power(3) * 1)
        c.scale.max.copy(c.scale.min)

        c.lifetime.duration = between(0.5, 1.5)

        c.color.min.lerpColors(new Color("#444"), new Color("#000"), power(3))
        c.color.max.copy(c.color.min)
      }}
    />
  </MeshParticles>
)

const Fireball = () => (
  <MeshParticles maxParticles={15}>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <MeshParticlesMaterial
      baseMaterial={MeshStandardMaterial}
      color="#fff"
      depthWrite={false}
      transparent
    />

    <Emitter
      count={() => 5 + power(3) * 10}
      setup={(c) => {
        direction.randomDirection()
        c.position.copy(direction).multiplyScalar(between(0, 2))
        c.velocity.copy(direction).multiplyScalar(between(2, 4))

        c.scale.min.setScalar(between(0.5, 1))
        c.scale.max.setScalar(between(3, 6))

        c.lifetime.delay = upTo(0.3)
        c.lifetime.duration = between(0.8, 1.4)

        c.color.min.lerpColors(
          new Color("red").multiplyScalar(30),
          new Color("yellow").multiplyScalar(50),
          power(3)
        )
        c.color.max.copy(c.color.min)
        c.alpha.max = 0
      }}
    />
  </MeshParticles>
)

const SmokeCloud: FC<{ depthTexture: DepthTexture }> = ({ depthTexture }) => (
  <MeshParticles maxParticles={100}>
    <planeGeometry />

    <MeshParticlesMaterial
      baseMaterial={MeshStandardMaterial}
      blending={NormalBlending}
      map={useTexture("/textures/smoke.png")}
      depthWrite={false}
      billboard
      transparent
      softness={3}
      depthTexture={depthTexture}
    />

    <Emitter
      count={between(30, 60)}
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

        c.scale.min.setScalar(between(0.5, 1.5))
        c.scale.max.setScalar(between(6, 20))

        c.lifetime.delay = upTo(0.1)
        c.lifetime.duration = between(1, 3)

        c.alpha.min = 0.5
        c.alpha.max = 0

        c.color.min.lerpColors(new Color("#888"), new Color("#666"), power(3))
        c.color.max.copy(c.color.min)
      }}
    />
  </MeshParticles>
)

export const Explosion = (props: GroupProps) => {
  const depthTexture = useDepthBuffer().depthTexture

  return (
    <group {...props}>
      <Lifetime seconds={5}>
        <SmokeRing depthTexture={depthTexture} />

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

            <SmokeCloud depthTexture={depthTexture} />
          </Delay>
        </Delay>
      </Lifetime>
    </group>
  )
}
