import { Emitter, MeshParticles, ParticlesMaterial } from "@hmans/vfx"
import { GroupProps } from "@react-three/fiber"
import { between, plusMinus, power } from "randomish"
import { Vector3 } from "three"

const gravity = new Vector3(0, -20, 0)
const direction = new Vector3()

const SmokeRing = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="white" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(25, 40)}
      burstCount={5}
      burstDelay={0.025}
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
      }}
    />
  </MeshParticles>
)

const Dirt = ({ delay = 0 }) => (
  <MeshParticles>
    <dodecahedronBufferGeometry />
    <ParticlesMaterial color="#444" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => power(3) * 200}
      burstCount={() => power(3) * 5}
      burstDelay={0.025}
      setup={(c) => {
        direction
          .set(1, 0, 0)
          .applyAxisAngle(new Vector3(0, 0, 1), between(0, Math.PI / 4))
          .applyAxisAngle(new Vector3(0, 1, 0), between(0, Math.PI * 2))

        c.position.copy(direction).multiplyScalar(3 + plusMinus(0.2))

        c.velocity.copy(direction).multiplyScalar(10 + power(3) * 10)

        c.acceleration.copy(gravity)

        c.scaleStart.setScalar(0.2 + power(3) * 1)
        c.scaleEnd.copy(c.scaleStart)

        c.lifetime = between(0.5, 1.5)
      }}
    />
  </MeshParticles>
)

const Fireball = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="red" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(2, 3)}
      setup={(c) => {
        direction.randomDirection()
        c.position.copy(direction).multiplyScalar(between(0, 2))
        c.velocity.copy(direction).multiplyScalar(between(2, 4))
        c.scaleStart.setScalar(between(1, 2))
        c.scaleEnd.setScalar(3 + power(3))
        c.lifetime = 0.4
      }}
    />
  </MeshParticles>
)

const SmokeCloud = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="#888" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(5, 10)}
      burstCount={5}
      burstDelay={0.05}
      setup={(c) => {
        direction.randomDirection()

        c.position.copy(direction).multiplyScalar(between(0.5, 3))

        c.velocity
          .copy(direction)
          .multiplyScalar(between(2, 5))
          .add(new Vector3(0, between(2, 3), 0))

        c.acceleration
          .randomDirection()
          .multiplyScalar(between(0, 3))
          .add(direction.clone().multiplyScalar(-between(2, 5)))

        c.scaleStart.setScalar(between(0.5, 1))
        c.scaleEnd.setScalar(between(3, 6))
        c.lifetime = between(1, 2)
      }}
    />
  </MeshParticles>
)

const SimpleSmoke = (props: GroupProps) => (
  <group {...props} scale={0.2}>
    <SmokeRing />
    <Dirt />
    <Fireball />
    <SmokeCloud delay={0.1} />
  </group>
)

export default SimpleSmoke
